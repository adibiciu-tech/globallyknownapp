import http.server
import socketserver
import socket
import json
import os
import sys
import hashlib
import uuid
import secrets
import time
import urllib.parse
import urllib.request
import urllib.error
import ssl
import re

PORT = int(os.environ.get("PORT", 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data_store.json")
VIDEOS_FILE = os.path.join(BASE_DIR, "data", "videos.json")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def get_permanent_videos():
    if os.path.exists(VIDEOS_FILE):
        try:
            with open(VIDEOS_FILE, "r", encoding="utf-8") as f:
                vids = json.load(f)
                if isinstance(vids, list):
                    return vids
        except Exception as e:
            print("Error reading videos.json:", e)
    return []

def save_permanent_videos(videos):
    if not isinstance(videos, list):
        return
    for attempt in range(5):
        try:
            temp_file = VIDEOS_FILE + ".tmp"
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(videos, f, ensure_ascii=False, indent=2)
            os.replace(temp_file, VIDEOS_FILE)
            break
        except Exception as e:
            if attempt == 4:
                print("Error saving videos.json:", e)
            time.sleep(0.05)

def load_data():
    d = {"videos": [], "conversations": [], "progress": {}, "users": []}
    if os.path.exists(DATA_FILE):
        for attempt in range(5):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    d = json.load(f)
                    if "users" not in d:
                        d["users"] = []
                    break
            except Exception as e:
                if attempt == 4:
                    print("Error reading data_store.json:", e)
                time.sleep(0.05)
    # Never return empty videos if permanent storage has videos
    if not d.get("videos"):
        permanent_vids = get_permanent_videos()
        if permanent_vids:
            d["videos"] = permanent_vids
    return d

def save_data(data):
    for attempt in range(5):
        try:
            temp_file = DATA_FILE + ".tmp"
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            os.replace(temp_file, DATA_FILE)
            break
        except Exception as e:
            if attempt == 4:
                print("Error saving data_store.json:", e)
            time.sleep(0.05)
    if "videos" in data and isinstance(data["videos"], list):
        save_permanent_videos(data["videos"])

def hash_password(password, salt=None):
    if not salt:
        salt = secrets.token_hex(16)
    hashed = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(password, stored_hash):
    try:
        if not stored_hash or ":" not in stored_hash:
            return False
        salt, hashed = stored_hash.split(":", 1)
        return hashlib.sha256((salt + password).encode("utf-8")).hexdigest() == hashed
    except Exception:
        return False

def sanitize_user(user):
    if not user:
        return None
    copy = dict(user)
    copy.pop("passwordHash", None)
    return copy

def get_master_gemini_key(data=None):
    if data is None:
        data = load_data()
    for env_var in ["GEMINI_API_KEY", "GOOGLE_API_KEY", "GEMINI_KEY", "GOOGLE_GEMINI_API_KEY", "GEMINI_APIKEY", "API_KEY", "GEMINI"]:
        val = (os.environ.get(env_var) or "").strip().strip("\"' ")
        if val:
            return val
    raw = (data.get("geminiApiKey") or "").strip().strip("\"' ")
    return raw

WORDS_FILE = os.path.join(BASE_DIR, "data", "words.json")
CATEGORIES_FILE = os.path.join(BASE_DIR, "data", "categories.json")
SAVING_LISTS_FILE = os.path.join(BASE_DIR, "data", "saving_lists.json")

WORDS_CACHE = []
CATEGORIES_CACHE = []

def get_words():
    global WORDS_CACHE
    if not WORDS_CACHE and os.path.exists(WORDS_FILE):
        try:
            with open(WORDS_FILE, "r", encoding="utf-8") as f:
                WORDS_CACHE = json.load(f)
        except Exception as e:
            print("Error loading words.json:", e)
    return WORDS_CACHE

def get_categories():
    global CATEGORIES_CACHE
    if not CATEGORIES_CACHE and os.path.exists(CATEGORIES_FILE):
        try:
            with open(CATEGORIES_FILE, "r", encoding="utf-8") as f:
                CATEGORIES_CACHE = json.load(f)
        except Exception as e:
            print("Error loading categories.json:", e)
    return CATEGORIES_CACHE

def get_saving_lists():
    data = load_data()
    if "saving_lists" not in data or not data["saving_lists"]:
        if os.path.exists(SAVING_LISTS_FILE):
            try:
                with open(SAVING_LISTS_FILE, "r", encoding="utf-8") as f:
                    init_lists = json.load(f)
                    for idx, item in enumerate(init_lists):
                        if "id" not in item:
                            item["id"] = f"list_{idx+1}_{int(time.time())}"
                    data["saving_lists"] = init_lists
                    save_data(data)
            except Exception as e:
                print("Error loading default saving_lists.json:", e)
                data["saving_lists"] = []
        else:
            data["saving_lists"] = []
    return data.get("saving_lists", [])

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for API endpoints
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if path == "/api/words/random":
            words = get_words()
            if not words:
                self.send_error(404, "No words found")
                return
            word = secrets.choice(words)
            payload = json.dumps(word).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path == "/api/network-info":
            local_ip = get_local_ip()
            info = {
                "local_ip": local_ip,
                "port": PORT,
                "mobile_url": f"http://{local_ip}:{PORT}"
            }
            payload = json.dumps(info).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path.startswith("/api/words/analyze/"):
            target = urllib.parse.unquote(path[len("/api/words/analyze/"):].strip().lower())
            words = get_words()
            found = next((w for w in words if w.get("word", "").lower() == target), None)
            if not found:
                resp = json.dumps({"detail": f"Word '{target}' not found in database"}).encode("utf-8")
                self.send_response(404)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            payload = json.dumps(found).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path.startswith("/api/words/definition/"):
            target = urllib.parse.unquote(path[len("/api/words/definition/"):].strip().lower())
            words = get_words()
            found = next((w for w in words if w.get("word", "").lower() == target), None)
            defn = found.get("definition", "Definition not available") if found else "Definition not available"
            payload = json.dumps({"word": target, "definition": defn}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path == "/api/words" or path == "/api/words/":
            cat = query.get("category", [None])[0]
            words = get_words()
            if cat:
                cat_lower = cat.strip().lower()
                filtered = [w for w in words if w.get("colorCategory", "").strip().lower() == cat_lower]
            else:
                filtered = words
            payload = json.dumps(filtered).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path == "/api/categories" or path == "/api/categories/":
            cats = get_categories()
            payload = json.dumps(cats).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path == "/api/savings/lists" or path == "/api/savings/lists/":
            lists = get_saving_lists()
            payload = json.dumps(lists).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif path.startswith("/api/videos"):
            data = load_data()
            payload = json.dumps(data.get("videos", [])).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif self.path.startswith("/api/conversations"):
            data = load_data()
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            user_id = (qs.get("email", [None])[0] or qs.get("user", [None])[0] or "").strip().lower()
            if user_id:
                user_convs = data.get("user_conversations", {}).get(user_id, [])
                payload = json.dumps(user_convs).encode("utf-8")
            else:
                payload = json.dumps(data.get("conversations", [])).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif self.path.startswith("/api/progress"):
            data = load_data()
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            user_id = (qs.get("email", [None])[0] or qs.get("user", [None])[0] or "").strip().lower()
            if user_id:
                user_prog = data.get("user_progress", {}).get(user_id, {})
                payload = json.dumps(user_prog).encode("utf-8")
            else:
                payload = json.dumps(data.get("progress", {})).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif self.path.startswith("/api/sync"):
            data = load_data()
            payload = json.dumps(data).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        elif self.path.startswith("/api/admin/users/export.csv"):
            data = load_data()
            users = data.get("users", [])
            lines = ["Name,Email,Provider,JoinedDate,LastActive"]
            for u in users:
                if not isinstance(u, dict): continue
                nm = '"' + u.get("name", "").replace('"', '""') + '"'
                em = '"' + u.get("email", "").replace('"', '""') + '"'
                pr = u.get("authProvider", "email")
                created = time.strftime('%Y-%m-%d %H:%M', time.gmtime(u.get("createdAt", 0)/1000)) if u.get("createdAt") else ""
                last = time.strftime('%Y-%m-%d %H:%M', time.gmtime(u.get("lastLogin", u.get("createdAt", 0))/1000)) if (u.get("lastLogin") or u.get("createdAt")) else ""
                lines.append(f"{nm},{em},{pr},{created},{last}")
            csv_data = "\n".join(lines).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", 'attachment; filename="globallyknown_users.csv"')
            self.send_header("Content-Length", str(len(csv_data)))
            self.end_headers()
            self.wfile.write(csv_data)
            return

        elif self.path.startswith("/api/admin/users") or self.path.startswith("/api/auth/users"):
            data = load_data()
            users = [sanitize_user(u) for u in data.get("users", [])]
            payload = json.dumps({"count": len(users), "users": users}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        elif self.path.startswith("/api/config/google"):
            data = load_data()
            cid = data.get("googleClientId", os.environ.get("GOOGLE_CLIENT_ID", ""))
            payload = json.dumps({"googleClientId": cid}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        elif self.path.startswith("/api/config/gemini-status"):
            data = load_data()
            master_key = get_master_gemini_key(data)
            is_active = bool(master_key)
            masked = ""
            if master_key:
                masked = (master_key[:6] + "..." + master_key[-4:]) if len(master_key) > 10 else "***"
            matched_env_names = [k for k in os.environ.keys() if any(x in k.upper() for x in ['GEMINI', 'GOOGLE', 'KEY', 'API'])]
            payload = json.dumps({
                "active": is_active,
                "maskedKey": masked,
                "model": data.get("geminiModel", "gemini-3.6-flash"),
                "envNames": matched_env_names
            }).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

        if self.path.startswith("/api/auth/register"):
            try:
                payload = json.loads(body)
                name = (payload.get("name") or "").strip()
                email = (payload.get("email") or "").strip().lower()
                password = payload.get("password") or ""

                if not name:
                    raise ValueError("Name is required.")
                if not email or "@" not in email:
                    raise ValueError("A valid email address is required.")
                if len(password) < 6:
                    raise ValueError("Password must be at least 6 characters long.")

                data = load_data()
                users = data.get("users", [])
                if any(u.get("email") == email for u in users):
                    raise ValueError("An account with this email already exists.")

                new_user = {
                    "id": "usr_" + uuid.uuid4().hex[:12],
                    "name": name,
                    "email": email,
                    "passwordHash": hash_password(password),
                    "picture": f"https://ui-avatars.com/api/?name={urllib.parse.quote(name)}&background=4f46e5&color=fff&bold=true",
                    "role": "free",
                    "createdAt": int(time.time() * 1000)
                }
                users.append(new_user)
                data["users"] = users
                save_data(data)

                token = "tok_" + secrets.token_hex(24)
                resp = json.dumps({"success": True, "token": token, "user": sanitize_user(new_user)}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/auth/login"):
            try:
                payload = json.loads(body)
                email = (payload.get("email") or "").strip().lower()
                password = payload.get("password") or ""

                if not email or not password:
                    raise ValueError("Email and password are required.")

                data = load_data()
                users = data.get("users", [])
                user = next((u for u in users if u.get("email") == email), None)

                if not user or not verify_password(password, user.get("passwordHash")):
                    raise ValueError("Invalid email or password.")

                token = "tok_" + secrets.token_hex(24)
                resp = json.dumps({"success": True, "token": token, "user": sanitize_user(user)}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(401)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/config/google"):
            try:
                payload = json.loads(body)
                cid = (payload.get("googleClientId") or "").strip()
                data = load_data()
                data["googleClientId"] = cid
                save_data(data)
                resp = json.dumps({"success": True, "googleClientId": cid}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/config/gemini-key"):
            try:
                payload = json.loads(body)
                key_val = (payload.get("geminiApiKey") or payload.get("apiKey") or "").strip()
                data = load_data()
                data["geminiApiKey"] = key_val
                save_data(data)
                masked = (key_val[:6] + "..." + key_val[-4:]) if len(key_val) > 10 else ("***" if key_val else "")
                resp = json.dumps({
                    "success": True,
                    "active": bool(key_val),
                    "maskedKey": masked
                }).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/chat"):
            try:
                payload = json.loads(body)
                messages = payload.get("messages", [])
                system_instruction = payload.get("systemInstruction", "")
                requested_model = payload.get("model") or "gemini-3.6-flash"
                if requested_model in ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-pro", "gemini-1.5-pro"]:
                    requested_model = "gemini-3.6-flash"
                is_title = payload.get("isTitle", False)

                data = load_data()
                master_key = get_master_gemini_key(data)
                if not master_key:
                    resp = json.dumps({"error": "No platform Gemini API key configured on the server."}).encode("utf-8")
                    self.send_response(503)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return

                # Build Gemini API request contents
                contents = []
                for m in messages:
                    role = "model" if m.get("role") == "model" else "user"
                    text = m.get("content") or ""
                    if not text and m.get("parts") and len(m.get("parts")) > 0:
                        text = m["parts"][0].get("text", "")
                    contents.append({"role": role, "parts": [{"text": text}]})

                req_body = {"contents": contents}
                if system_instruction:
                    req_body["systemInstruction"] = {"parts": [{"text": system_instruction}]}

                if is_title:
                    req_body["generationConfig"] = {"maxOutputTokens": 16, "temperature": 0.3}

                # Try production models in priority order
                models_to_try = [
                    requested_model,
                    "gemini-3.6-flash",
                    "gemini-3.5-flash-lite",
                    "gemini-2.5-flash"
                ]
                seen = set()
                candidate_models = []
                for m in models_to_try:
                    if m and m not in seen and m != "gemini-pro":
                        seen.add(m)
                        candidate_models.append(m)

                ctx = ssl.create_default_context()
                last_error = None
                errors_by_model = {}
                reply_text = None
                used_model = None

                for mod in candidate_models:
                    # For AQ. authentication keys, pass strictly via x-goog-api-key header without query parameter
                    if master_key.startswith("AQ."):
                        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{mod}:generateContent"
                    else:
                        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{mod}:generateContent?key={master_key}"

                    headers = {
                        "Content-Type": "application/json",
                        "x-goog-api-key": master_key
                    }

                    req = urllib.request.Request(
                        gemini_url,
                        data=json.dumps(req_body).encode("utf-8"),
                        headers=headers,
                        method="POST"
                    )
                    try:
                        with urllib.request.urlopen(req, context=ctx, timeout=30) as g_resp:
                            res_json = json.loads(g_resp.read().decode("utf-8"))
                            candidates = res_json.get("candidates", [])
                            if candidates and "content" in candidates[0]:
                                parts = candidates[0]["content"].get("parts", [])
                                valid_parts = [p for p in parts if not p.get("thought")]
                                target_parts = valid_parts if valid_parts else parts
                                reply_text = "\n".join([p.get("text", "") for p in target_parts])
                                used_model = mod
                                break
                    except urllib.error.HTTPError as e:
                        err_content = e.read().decode("utf-8")
                        try:
                            err_json = json.loads(err_content)
                            last_error = err_json.get("error", {}).get("message", str(e))
                        except Exception:
                            last_error = err_content
                        errors_by_model[mod] = last_error
                    except Exception as e:
                        last_error = str(e)
                        errors_by_model[mod] = last_error

                if reply_text is not None:
                    resp = json.dumps({"success": True, "reply": reply_text, "model": used_model}).encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                else:
                    resp = json.dumps({
                        "error": f"Gemini API request failed: {last_error}",
                        "details": errors_by_model
                    }).encode("utf-8")
                    self.send_response(502)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/auth/google"):
            try:
                payload = json.loads(body)
                email = (payload.get("email") or "").strip().lower()
                name = (payload.get("name") or "").strip() or "Google User"
                picture = payload.get("picture") or f"https://ui-avatars.com/api/?name={urllib.parse.quote(name)}&background=4285F4&color=fff&bold=true"

                if not email:
                    raise ValueError("Google email is required.")

                data = load_data()
                users = data.get("users", [])
                user = next((u for u in users if u.get("email") == email), None)

                now_ts = int(time.time() * 1000)
                if not user:
                    user = {
                        "id": "usr_g_" + uuid.uuid4().hex[:10],
                        "name": name,
                        "email": email,
                        "picture": picture,
                        "role": "free",
                        "authProvider": "google",
                        "createdAt": now_ts,
                        "lastLogin": now_ts,
                        "loginCount": 1
                    }
                    users.append(user)
                    data["users"] = users
                    save_data(data)
                else:
                    user["lastLogin"] = now_ts
                    user["loginCount"] = user.get("loginCount", 1) + 1
                    if name and user.get("name") in ("Google User", ""):
                        user["name"] = name
                    if picture and not user.get("picture"):
                        user["picture"] = picture
                    save_data(data)

                token = "tok_" + secrets.token_hex(24)
                resp = json.dumps({"success": True, "token": token, "user": sanitize_user(user)}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        if self.path.startswith("/api/videos/update"):
            try:
                payload = json.loads(body)
                vid_id = payload.get("id")
                new_title = payload.get("title")
                data = load_data()
                existing = data.get("videos", [])
                for v in existing:
                    if isinstance(v, dict) and v.get("id") == vid_id:
                        if new_title:
                            v["title"] = str(new_title).strip()
                        break
                data["videos"] = existing
                save_data(data)
                save_permanent_videos(existing)
                resp = json.dumps({"success": True, "count": len(existing), "videos": existing}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        if self.path.startswith("/api/videos/delete"):
            try:
                payload = json.loads(body)
                vid_id = payload.get("id")
                data = load_data()
                existing = data.get("videos", [])
                filtered = [v for v in existing if isinstance(v, dict) and v.get("id") != vid_id]
                data["videos"] = filtered
                save_data(data)
                save_permanent_videos(filtered)
                resp = json.dumps({"success": True, "count": len(filtered), "videos": filtered}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/videos/import") or self.path.startswith("/api/videos/restore"):
            try:
                imported = json.loads(body)
                if isinstance(imported, dict) and "videos" in imported:
                    imported = imported["videos"]
                if isinstance(imported, list):
                    data = load_data()
                    # Union merge imported with existing
                    existing = data.get("videos", [])
                    vmap = {v["id"]: v for v in existing if isinstance(v, dict) and "id" in v}
                    for v in imported:
                        if isinstance(v, dict) and "id" in v:
                            vmap[v["id"]] = v
                    merged = list(vmap.values())
                    data["videos"] = merged
                    save_data(data)
                    save_permanent_videos(merged)
                    resp = json.dumps({"success": True, "count": len(merged), "videos": merged}).encode("utf-8")
                else:
                    resp = json.dumps({"error": "Invalid format, array of videos expected"}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/videos"):
            try:
                posted_videos = json.loads(body)
                if isinstance(posted_videos, list):
                    data = load_data()
                    blacklist_ids = {"vid_test_123", "custom_1789590071219_0liw7", "custom_1789590112159_1zwrb"}
                    blacklist_urls = {"3i_JmO7zM0A", "gCWYp2zJpB8"}
                    cleaned = []
                    seen = set()
                    for v in posted_videos:
                        if not isinstance(v, dict) or "id" not in v:
                            continue
                        vid_id = str(v.get("id", ""))
                        url = str(v.get("embedUrl", ""))
                        if vid_id in blacklist_ids or any(b in url for b in blacklist_urls):
                            continue
                        if vid_id in seen:
                            continue
                        seen.add(vid_id)
                        if "youtube" in url and "videoseries" not in url:
                            url = re.sub(r'[?&]list=[a-zA-Z0-9_-]+', '', url)
                            url = re.sub(r'\?&', '?', url)
                            url = re.sub(r'\?$', '', url)
                            v["embedUrl"] = url
                        cleaned.append(v)
                    data["videos"] = cleaned
                    save_data(data)
                    save_permanent_videos(cleaned)
                    resp = json.dumps({"success": True, "count": len(cleaned), "videos": cleaned}).encode("utf-8")
                else:
                    resp = json.dumps({"error": "Array expected"}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/conversations"):
            try:
                parsed = urllib.parse.urlparse(self.path)
                qs = urllib.parse.parse_qs(parsed.query)
                user_id = (qs.get("email", [None])[0] or qs.get("user", [None])[0] or "").strip().lower()
                
                payload = json.loads(body)
                data = load_data()
                
                if isinstance(payload, dict) and "conversations" in payload:
                    if not user_id and payload.get("email"):
                        user_id = str(payload.get("email")).strip().lower()
                    convs = payload.get("conversations", [])
                else:
                    convs = payload

                if user_id:
                    if "user_conversations" not in data:
                        data["user_conversations"] = {}
                    data["user_conversations"][user_id] = convs
                else:
                    data["conversations"] = convs
                
                save_data(data)
                resp = json.dumps({"success": True, "count": len(convs)}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/progress"):
            try:
                parsed = urllib.parse.urlparse(self.path)
                qs = urllib.parse.parse_qs(parsed.query)
                user_id = (qs.get("email", [None])[0] or qs.get("user", [None])[0] or "").strip().lower()
                
                payload = json.loads(body)
                data = load_data()
                if isinstance(payload, dict) and not user_id and payload.get("email"):
                    user_id = str(payload.get("email")).strip().lower()

                if user_id:
                    if "user_progress" not in data:
                        data["user_progress"] = {}
                    data["user_progress"][user_id] = payload
                else:
                    data["progress"] = payload

                save_data(data)
                resp = json.dumps({"success": True}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/sync"):
            try:
                payload = json.loads(body)
                data = load_data()
                user_id = (payload.get("email") or "").strip().lower()
                if "videos" in payload:
                    data["videos"] = payload["videos"]
                if "conversations" in payload:
                    if user_id:
                        if "user_conversations" not in data:
                            data["user_conversations"] = {}
                        data["user_conversations"][user_id] = payload["conversations"]
                    else:
                        data["conversations"] = payload["conversations"]
                if "progress" in payload:
                    if user_id:
                        if "user_progress" not in data:
                            data["user_progress"] = {}
                        data["user_progress"][user_id] = payload["progress"]
                    else:
                        data["progress"] = payload["progress"]
                save_data(data)
                resp = json.dumps({"success": True}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return
        elif self.path == "/api/savings/lists" or self.path == "/api/savings/lists/":
            try:
                payload = json.loads(body)
                name = (payload.get("name") or "").strip()
                if not name:
                    raise ValueError("List name cannot be empty")
                data = load_data()
                lists = data.get("saving_lists", [])
                if any(l.get("name", "").strip().lower() == name.lower() for l in lists):
                    self.send_response(400)
                    resp = json.dumps({"detail": "List name already exists"}).encode("utf-8")
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return
                new_list = {
                    "id": f"list_{uuid.uuid4().hex[:8]}",
                    "name": name,
                    "words": []
                }
                lists.append(new_list)
                data["saving_lists"] = lists
                save_data(data)
                resp = json.dumps(new_list).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return
        elif self.path.startswith("/api/savings/lists/") and self.path.endswith("/words"):
            try:
                parts = self.path.strip("/").split("/")
                list_id = parts[3]
                payload = json.loads(body)
                data = load_data()
                lists = data.get("saving_lists", [])
                target_list = next((l for l in lists if str(l.get("id")) == list_id), None)
                if not target_list:
                    self.send_response(404)
                    resp = json.dumps({"detail": "List not found"}).encode("utf-8")
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return
                word_str = (payload.get("word") or "").strip()
                if any(w.get("word", "").lower() == word_str.lower() for w in target_list.get("words", [])):
                    self.send_response(400)
                    resp = json.dumps({"detail": "Word already in list"}).encode("utf-8")
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return
                target_list.setdefault("words", []).append(payload)
                data["saving_lists"] = lists
                save_data(data)
                resp = json.dumps({"success": True}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        super().do_POST()

    def do_DELETE(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path.startswith("/api/savings/lists/"):
            parts = path.strip("/").split("/")
            # e.g. api/savings/lists/{id}/words/{word}
            if len(parts) >= 5 and parts[3] == "words":
                list_id = parts[2]
                word_to_remove = urllib.parse.unquote(parts[4]).lower()
                data = load_data()
                lists = data.get("saving_lists", [])
                target_list = next((l for l in lists if str(l.get("id")) == list_id), None)
                if target_list:
                    target_list["words"] = [w for w in target_list.get("words", []) if (w.get("word") or "").lower() != word_to_remove]
                    data["saving_lists"] = lists
                    save_data(data)
                resp = json.dumps({"success": True}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            elif len(parts) == 3 and parts[0] == "api" and parts[1] == "savings" and parts[2].startswith("lists"):
                pass
            elif len(parts) >= 3:
                list_id = parts[2]
                data = load_data()
                data["saving_lists"] = [l for l in data.get("saving_lists", []) if str(l.get("id")) != list_id]
                save_data(data)
                resp = json.dumps({"success": True}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return

        self.send_error(404, "Not Found")

if __name__ == "__main__":
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    local_ip = get_local_ip()
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("\n" + "=" * 60)
        print("  GLOBALLY KNOWN SERVER RUNNING & READY!")
        print(f"  Laptop/PC URL:  http://localhost:{PORT}")
        print(f"  Mobile Phone:   http://{local_ip}:{PORT}")
        print("=" * 60 + "\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
