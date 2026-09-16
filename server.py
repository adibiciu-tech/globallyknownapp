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

PORT = int(os.environ.get("PORT", 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data_store.json")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def load_data():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                d = json.load(f)
                if "users" not in d:
                    d["users"] = []
                return d
        except Exception as e:
            print("Error reading data_store.json:", e)
    return {"videos": [], "conversations": [], "progress": {}, "users": []}

def save_data(data):
    try:
        temp_file = DATA_FILE + ".tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(temp_file, DATA_FILE)
    except Exception as e:
        print("Error saving data_store.json:", e)

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
            payload = json.dumps(data.get("conversations", [])).encode("utf-8")
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
        elif self.path.startswith("/api/auth/users"):
            data = load_data()
            users = [sanitize_user(u) for u in data.get("users", [])]
            payload = json.dumps(users).encode("utf-8")
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

                if not user:
                    user = {
                        "id": "usr_g_" + uuid.uuid4().hex[:10],
                        "name": name,
                        "email": email,
                        "picture": picture,
                        "role": "free",
                        "authProvider": "google",
                        "createdAt": int(time.time() * 1000)
                    }
                    users.append(user)
                    data["users"] = users
                    save_data(data)
                else:
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

        if self.path.startswith("/api/videos"):
            try:
                videos = json.loads(body)
                data = load_data()
                data["videos"] = videos
                save_data(data)
                resp = json.dumps({"success": True, "count": len(videos)}).encode("utf-8")
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
                convs = json.loads(body)
                data = load_data()
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

        elif self.path.startswith("/api/sync"):
            try:
                payload = json.loads(body)
                data = load_data()
                if "videos" in payload:
                    data["videos"] = payload["videos"]
                if "conversations" in payload:
                    data["conversations"] = payload["conversations"]
                if "progress" in payload:
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
