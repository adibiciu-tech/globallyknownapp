import http.server
import socketserver
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

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for API endpoints
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
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
        if self.path.startswith("/api/videos"):
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
            return

        super().do_POST()

if __name__ == "__main__":
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving HTTP on 0.0.0.0 port {PORT} with persistent API sync...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
