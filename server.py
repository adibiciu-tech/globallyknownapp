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

DEFAULT_COMMUNITY_CHANNELS = [
    {"id": "rules-faq", "name": "rules", "type": "highlight", "icon": "fa-clipboard-check red-icon", "desc": "Community code of conduct, immersion principles, and cohort etiquette."},
    {"id": "announcements", "name": "welcome-and-announcements", "type": "highlight", "icon": "fa-bullhorn", "desc": "Official updates, schedules, and notices from the Globally Known team.", "badge": "NEW", "unread": True},
    {"id": "general-chat", "name": "general-chat", "type": "text", "icon": "fa-hashtag", "desc": "Informal conversations, greetings, and daily check-ins with fellow learners."},
    {"id": "english-inputs", "name": "english-inputs", "type": "text", "icon": "fa-hashtag", "desc": "Discuss vocabulary, structures, and notes from City Vlog lessons."},
    {"id": "metaphors", "name": "metaphors-discussion", "type": "text", "icon": "fa-hashtag", "desc": "Explore semantic networks, cognitive metaphors, and cultural idioms."},
    {"id": "ask-sol-community", "name": "ask-sol-community", "type": "text", "icon": "fa-hashtag", "desc": "Get real-time explanations from Sol AI Coach and community linguists."},
    {"id": "featurings", "name": "featurings", "type": "text", "icon": "fa-hashtag", "desc": "Share your accuracy metrics, speech recordings, and feature suggestions."},
    {"id": "voice-study-lounge", "name": "Study Lounge 1", "type": "voice", "icon": "fa-volume-high", "desc": "Low-latency voice room for group listening, shadowing, and discussion.", "countTag": "2", "attendees": ["Gregory Dobbins (Host)", "Sarah K."]},
    {"id": "voice-accent-lab", "name": "Pronunciation Lab", "type": "voice", "icon": "fa-volume-high", "desc": "Live acoustic feedback and interactive phonetic drills with coaches."}
]

DEFAULT_COMMUNITY_MEMBERS = [
    {"id": "mem_1", "name": "Gregory Dobbins", "role": "Program Manager 🎓", "status": "online", "avatar": "GD", "roleType": "staff", "group": "coaches"},
    {"id": "mem_2", "name": "Sarah K.", "role": "Language Coach 🏅", "status": "online", "avatar": "SK", "roleType": "coach", "group": "coaches"},
    {"id": "mem_3", "name": "Elena Rostova", "role": "Linguist & Phonetics 🌍", "status": "online", "avatar": "ER", "roleType": "coach", "group": "coaches"},
    {"id": "mem_4", "name": "Alice F.", "role": "Member 👤", "status": "online", "avatar": "AF", "roleType": "member", "group": "online"},
    {"id": "mem_5", "name": "Carlos M.", "role": "Member 👤", "status": "online", "avatar": "CM", "roleType": "member", "group": "online"},
    {"id": "mem_6", "name": "Li Wei", "role": "Member 👤", "status": "online", "avatar": "LW", "roleType": "member", "group": "online"},
    {"id": "mem_7", "name": "Bob D.", "role": "Member 👤", "status": "offline", "avatar": "BD", "roleType": "member", "group": "offline"},
    {"id": "mem_8", "name": "Marcus Vance", "role": "Moderator 🛡️", "status": "offline", "avatar": "MV", "roleType": "member", "group": "offline"}
]

MASTER_ADMIN_EMAILS = {"sinsecontactmilla@gmail.com", "globallyknownrappers@gmail.com"}

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
    if "community_channels" not in d or not isinstance(d["community_channels"], list) or len(d["community_channels"]) == 0:
        d["community_channels"] = [dict(c) for c in DEFAULT_COMMUNITY_CHANNELS]
    if "community_members" not in d or not isinstance(d["community_members"], list) or len(d["community_members"]) == 0:
        d["community_members"] = [dict(m) for m in DEFAULT_COMMUNITY_MEMBERS]
    admin_list = set(str(x).strip().lower() for x in d.get("admin_emails", []))
    admin_list.discard("adrian.milla@gmail.com")
    for ma in MASTER_ADMIN_EMAILS:
        admin_list.add(ma)
    d["admin_emails"] = list(admin_list)
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

MASTER_ADMIN_EMAILS = {"sinsecontactmilla@gmail.com", "globallyknownrappers@gmail.com"}

def is_admin_email(email, data=None):
    if not email:
        return False
    em = str(email).strip().lower()
    if em in MASTER_ADMIN_EMAILS:
        return True
    if data is None:
        data = load_data()
    admin_list = [str(x).strip().lower() for x in data.get("admin_emails", [])]
    if em in admin_list:
        return True
    for u in data.get("users", []):
        if isinstance(u, dict) and str(u.get("email", "")).strip().lower() == em and u.get("role") == "admin":
            return True
    return False

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

def fetch_youtube_playlist(url_or_id):
    import re, json, urllib.parse, xml.etree.ElementTree as ET
    m = re.search(r'[?&]list=([a-zA-Z0-9_-]+)', url_or_id)
    pl_id = m.group(1) if m else url_or_id.strip()
    
    if not pl_id:
        return {"success": False, "error": "Invalid playlist URL or ID"}

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    }

    def extract_items_from_json(obj, items, seen):
        if isinstance(obj, dict):
            # 1. playlistVideoRenderer
            if 'playlistVideoRenderer' in obj:
                pvr = obj['playlistVideoRenderer']
                vid = pvr.get('videoId')
                if vid and vid not in seen:
                    seen.add(vid)
                    t = pvr.get('title', {})
                    title = ''
                    if 'runs' in t: title = ''.join(r.get('text', '') for r in t['runs'])
                    elif 'simpleText' in t: title = t.get('simpleText', '')
                    lt = pvr.get('lengthText', {}).get('simpleText', '')
                    items.append({
                        "videoId": vid,
                        "title": title or f"Lesson {len(items)+1}",
                        "embedUrl": f"https://www.youtube.com/embed/{vid}",
                        "thumbUrl": f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
                        "duration": lt
                    })

            # 2. lockupViewModel
            if 'lockupViewModel' in obj:
                lvm = obj['lockupViewModel']
                vid = None
                try:
                    vid = lvm['rendererContext']['commandContext']['onTap']['innertubeCommand']['watchEndpoint']['videoId']
                except Exception:
                    pass
                if not vid:
                    vid = lvm.get('contentId')
                if vid and vid not in seen:
                    seen.add(vid)
                    title = ''
                    try:
                        title = lvm['metadata']['lockupMetadataViewModel']['title']['content']
                    except Exception:
                        pass
                    if not title:
                        try:
                            title = lvm['rendererContext']['accessibilityContext']['label']
                        except Exception:
                            pass
                    items.append({
                        "videoId": vid,
                        "title": title or f"Lesson {len(items)+1}",
                        "embedUrl": f"https://www.youtube.com/embed/{vid}",
                        "thumbUrl": f"https://img.youtube.com/vi/{vid}/hqdefault.jpg",
                        "duration": ""
                    })

            for v in obj.values():
                extract_items_from_json(v, items, seen)
        elif isinstance(obj, list):
            for it in obj:
                extract_items_from_json(it, items, seen)

    def find_continuation_token(obj):
        if isinstance(obj, dict):
            if 'continuationCommand' in obj and 'token' in obj['continuationCommand']:
                return obj['continuationCommand']['token']
            for v in obj.values():
                t = find_continuation_token(v)
                if t: return t
        elif isinstance(obj, list):
            for it in obj:
                t = find_continuation_token(it)
                if t: return t
        return None

    # Step 1: Web Scraping for Full Playlist
    try:
        url = f"https://www.youtube.com/playlist?list={pl_id}"
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')

        key_m = re.search(r'"INNERTUBE_API_KEY":"([a-zA-Z0-9_-]+)"', html)
        api_key = key_m.group(1) if key_m else None
        
        m_data = re.search(r'ytInitialData\s*=\s*({.+?});(?:</script>|\n)', html)
        if m_data:
            data = json.loads(m_data.group(1))
            
            pl_title = ""
            try:
                pl_title = data.get('header', {}).get('playlistHeaderRenderer', {}).get('title', {}).get('simpleText', '')
            except Exception: pass
            if not pl_title:
                try:
                    pl_title = data.get('metadata', {}).get('playlistMetadataRenderer', {}).get('title', '')
                except Exception: pass
            if not pl_title:
                title_m = re.search(r'<title>(.+?)(?: - YouTube)?</title>', html)
                if title_m: pl_title = title_m.group(1).replace(" - YouTube", "").strip()

            videos = []
            seen = set()
            extract_items_from_json(data, videos, seen)

            # Paginate through continuations if any (up to 10 pages / 1000 items max)
            token = find_continuation_token(data)
            pages = 0
            while token and api_key and pages < 10:
                pages += 1
                try:
                    dec_token = urllib.parse.unquote(token)
                    browse_url = f"https://www.youtube.com/youtubei/v1/browse?key={api_key}"
                    payload = json.dumps({
                        "context": {
                            "client": {
                                "clientName": "WEB",
                                "clientVersion": "2.20240101.00.00"
                            }
                        },
                        "continuation": dec_token
                    }).encode('utf-8')
                    b_req = urllib.request.Request(browse_url, data=payload, headers={
                        'Content-Type': 'application/json',
                        'User-Agent': headers['User-Agent']
                    })
                    b_data = json.loads(urllib.request.urlopen(b_req, timeout=8).read().decode('utf-8'))
                    prev_count = len(videos)
                    extract_items_from_json(b_data, videos, seen)
                    if len(videos) == prev_count:
                        break
                    token = find_continuation_token(b_data)
                except Exception as ce:
                    print("Continuation notice:", ce)
                    break

            if videos:
                return {
                    "success": True,
                    "playlistId": pl_id,
                    "playlistTitle": pl_title or "YouTube Playlist",
                    "count": len(videos),
                    "videos": videos
                }
    except Exception as e:
        print("HTML scrape notice:", e)

    # Step 2: Fallback to RSS Atom Feed
    try:
        feed_url = f"https://www.youtube.com/feeds/videos.xml?playlist_id={pl_id}"
        req = urllib.request.Request(feed_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
        root = ET.fromstring(content)
        ns = {
            "atom": "http://www.w3.org/2005/Atom",
            "yt": "http://www.youtube.com/xml/schemas/2015"
        }
        title_el = root.find("atom:title", ns)
        pl_title = title_el.text if title_el is not None and title_el.text else "YouTube Playlist"
        videos = []
        for entry in root.findall("atom:entry", ns):
            vid_id_el = entry.find("yt:videoId", ns)
            t_el = entry.find("atom:title", ns)
            if vid_id_el is not None and vid_id_el.text:
                vid_id = vid_id_el.text.strip()
                v_title = t_el.text.strip() if t_el is not None and t_el.text else f"Lesson {len(videos)+1}"
                videos.append({
                    "videoId": vid_id,
                    "title": v_title,
                    "embedUrl": f"https://www.youtube.com/embed/{vid_id}",
                    "thumbUrl": f"https://img.youtube.com/vi/{vid_id}/hqdefault.jpg"
                })
        return {
            "success": True,
            "playlistId": pl_id,
            "playlistTitle": pl_title,
            "count": len(videos),
            "videos": videos
        }
    except Exception as e2:
        return {"success": False, "error": f"Failed to fetch YouTube playlist: {str(e2)}"}

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for API endpoints
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Alt-Svc", "clear")
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
        elif path.startswith("/api/youtube/categories"):
            data = load_data()
            cats = data.get("playlist_categories", [])
            deleted_ids = data.get("deleted_playlist_categories", [])
            resp = json.dumps({"success": True, "categories": cats, "deletedCategoryIds": deleted_ids}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return
        elif path.startswith("/api/youtube/playlist"):
            target_url = query.get("url", [None])[0] or query.get("list", [None])[0]
            if not target_url:
                resp = json.dumps({"success": False, "error": "Missing url or list parameter"}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            result = fetch_youtube_playlist(target_url)
            resp = json.dumps(result).encode("utf-8")
            self.send_response(200 if result.get("success") else 400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
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
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            caller = (qs.get("email", [None])[0] or qs.get("user", [None])[0] or self.headers.get("X-User-Email", "") or "").strip().lower()
            data = load_data()
            if not is_admin_email(caller, data):
                self.send_error(403, "Forbidden: Only platform administrator can access user export")
                return
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
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            caller = (qs.get("email", [None])[0] or qs.get("user", [None])[0] or self.headers.get("X-User-Email", "") or "").strip().lower()
            data = load_data()
            if not is_admin_email(caller, data):
                self.send_error(403, "Forbidden: Only platform administrator can view registered users")
                return
            users = [sanitize_user(u) for u in data.get("users", [])]
            admin_emails = list(set([str(x).strip().lower() for x in data.get("admin_emails", [])] + list(MASTER_ADMIN_EMAILS)))
            payload = json.dumps({"count": len(users), "users": users, "adminEmails": admin_emails}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        elif self.path.startswith("/api/community/data") or self.path.startswith("/api/community/channels"):
            data = load_data()
            channels = data.get("community_channels", None)
            members = data.get("community_members", None)
            resp = json.dumps({"success": True, "channels": channels, "members": members}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
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

        elif self.path.startswith("/api/tts"):
            parsed = urllib.parse.urlparse(self.path)
            qs = urllib.parse.parse_qs(parsed.query)
            raw_text = (qs.get("text", [""])[0] or "").strip()
            lang = (qs.get("lang", ["en-US"])[0] or "en-US").strip()
            if not raw_text:
                self.send_error(400, "Missing text parameter")
                return

            clean = re.sub(r'[*_#`~>]', '', raw_text)
            clean = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', clean)
            clean = re.sub(r'https?://\S+', '', clean)
            clean = re.sub(r'\s+', ' ', clean).strip()
            if not clean:
                self.send_error(400, "Empty cleaned text")
                return

            lang_code = lang.split("-")[0].lower() if "-" in lang else lang.lower()
            chunks = re.findall(r'.{1,160}(?:[.!?,;:\s]+|$)', clean)
            if not chunks:
                chunks = [clean[:160]]

            combined_audio = b""
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Referer": "https://translate.google.com/"
            }

            for chunk in chunks[:12]:
                c_text = chunk.strip()
                if not c_text:
                    continue
                tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={urllib.parse.quote(lang_code)}&client=tw-ob&q={urllib.parse.quote(c_text)}"
                try:
                    req = urllib.request.Request(tts_url, headers=headers)
                    with urllib.request.urlopen(req, timeout=8) as r:
                        combined_audio += r.read()
                except Exception as e:
                    print(f"Error fetching TTS chunk for '{c_text[:30]}':", e)

            if not combined_audio:
                self.send_error(502, "Failed to generate TTS audio")
                return

            self.send_response(200)
            self.send_header("Content-Type", "audio/mpeg")
            self.send_header("Content-Length", str(len(combined_audio)))
            self.send_header("Cache-Control", "public, max-age=86400")
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            self.wfile.write(combined_audio)
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
                caller = (payload.get("email") or payload.get("user") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only platform administrator can update Google Client ID")
                    return
                cid = (payload.get("googleClientId") or "").strip()
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
                caller = (payload.get("email") or payload.get("user") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only platform administrator can update Gemini Master Key")
                    return
                key_val = (payload.get("geminiApiKey") or payload.get("apiKey") or "").strip()
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

        elif self.path.startswith("/api/admin/users/set-role"):
            try:
                payload = json.loads(body)
                caller = (payload.get("adminEmail") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can grant or revoke permissions")
                    return

                target_email = (payload.get("targetEmail") or "").strip().lower()
                new_role = (payload.get("role") or "member").strip().lower()

                if not target_email:
                    raise ValueError("targetEmail is required")

                admin_list = set(str(x).strip().lower() for x in data.get("admin_emails", []))
                users = data.get("users", [])
                for u in users:
                    if isinstance(u, dict) and str(u.get("email", "")).strip().lower() == target_email:
                        u["role"] = new_role
                        break

                if new_role == "admin":
                    admin_list.add(target_email)
                else:
                    if target_email not in MASTER_ADMIN_EMAILS:
                        admin_list.discard(target_email)

                data["admin_emails"] = list(admin_list)
                data["users"] = users
                save_data(data)

                sanitized = [sanitize_user(u) for u in users]
                resp = json.dumps({"success": True, "users": sanitized, "adminEmails": list(admin_list), "admin_emails": list(admin_list)}).encode("utf-8")
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

        elif self.path.startswith("/api/grammar-check"):
            try:
                payload = json.loads(body)
                text = (payload.get("text") or "").strip()
                if not text or len(text) < 2:
                    resp = json.dumps({"corrected": None, "hasChanges": False}).encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return

                data = load_data()
                master_key = get_master_gemini_key(data)
                if not master_key:
                    resp = json.dumps({"corrected": None, "hasChanges": False, "note": "No platform API key"}).encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return

                prompt = (
                    "You are an expert English grammar proofreader for language learners.\n"
                    "Analyze the user's sentence. Check for grammatical errors, wrong tenses, wrong verb forms, subject-verb disagreement, preposition errors, or spelling mistakes.\n\n"
                    "Rules:\n"
                    "1. If the sentence is grammatically correct or natural English, respond with ONLY: NO_CHANGES\n"
                    "2. If there are errors, output the sentence with each wrong word enclosed in <s>wrong</s> followed immediately by the correct word.\n"
                    "3. Do NOT rewrite or rephrase sentences if they are already grammatically acceptable.\n"
                    "4. Preserve original punctuation, casing, and word order as much as possible.\n"
                    "5. Output ONLY the marked-up sentence or NO_CHANGES. No explanation, no intro, no markdown code blocks.\n\n"
                    "Examples:\n"
                    "User: I am go to the store.\n"
                    "Assistant: I am <s>go</s> going to the store.\n\n"
                    "User: She don't like apples.\n"
                    "Assistant: She <s>don't</s> doesn't like apples.\n\n"
                    "User: I went to the store yesterday.\n"
                    "Assistant: NO_CHANGES\n\n"
                    f"User: {text}\n"
                    "Assistant:"
                )

                req_body = {
                    "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                    "generationConfig": {"maxOutputTokens": 120, "temperature": 0.1}
                }

                ctx = ssl.create_default_context()
                models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.6-flash"]
                corrected_result = None

                for mod in models_to_try:
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
                        with urllib.request.urlopen(req, context=ctx, timeout=8) as g_resp:
                            res_json = json.loads(g_resp.read().decode("utf-8"))
                            candidates = res_json.get("candidates", [])
                            if candidates and "content" in candidates[0]:
                                parts = candidates[0]["content"].get("parts", [])
                                reply_text = "".join([p.get("text", "") for p in parts]).strip()
                                if reply_text:
                                    corrected_result = reply_text
                                    break
                    except Exception as e:
                        continue

                if corrected_result and "NO_CHANGES" not in corrected_result and ("<s>" in corrected_result or "<strike>" in corrected_result or "<del>" in corrected_result):
                    resp = json.dumps({"corrected": corrected_result, "hasChanges": True}).encode("utf-8")
                else:
                    resp = json.dumps({"corrected": None, "hasChanges": False}).encode("utf-8")

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"error": str(e), "hasChanges": False}).encode("utf-8")
                self.send_response(200)
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

                # Build Gemini API request contents (Supports multimodal live camera vision!)
                contents = []
                for m in messages:
                    role = "model" if m.get("role") == "model" else "user"
                    if m.get("parts") and isinstance(m["parts"], list) and len(m["parts"]) > 0:
                        contents.append({"role": role, "parts": m["parts"]})
                    else:
                        text = m.get("content") or ""
                        contents.append({"role": role, "parts": [{"text": text}]})

                req_body = {"contents": contents}
                if system_instruction:
                    req_body["systemInstruction"] = {"parts": [{"text": system_instruction}]}

                if is_title:
                    req_body["generationConfig"] = {"maxOutputTokens": 16, "temperature": 0.3}

                # Try production models in priority order (Flash models support multimodal vision)
                models_to_try = [
                    requested_model,
                    "gemini-2.5-flash",
                    "gemini-1.5-flash",
                    "gemini-2.0-flash",
                    "gemini-3.6-flash",
                    "gemini-3.5-flash-lite"
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

                user_role = "admin" if is_admin_email(email, data) else "free"
                now_ts = int(time.time() * 1000)
                if not user:
                    user = {
                        "id": "usr_g_" + uuid.uuid4().hex[:10],
                        "name": name,
                        "email": email,
                        "picture": picture,
                        "role": user_role,
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
                    if is_admin_email(email, data):
                        user["role"] = "admin"
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

        elif self.path.startswith("/api/community/channels"):
            try:
                payload = json.loads(body)
                caller = (payload.get("adminEmail") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can manage community channels")
                    return

                action = payload.get("action", "")
                channels = data.get("community_channels", [])

                if action == "add":
                    new_ch = payload.get("channel", {})
                    if not new_ch.get("id"):
                        new_ch["id"] = "ch_" + uuid.uuid4().hex[:8]
                    channels.append(new_ch)
                elif action == "edit":
                    ch_id = payload.get("channelId")
                    updated_meta = payload.get("channel", {})
                    for ch in channels:
                        if ch.get("id") == ch_id:
                            ch.update(updated_meta)
                            break
                elif action == "delete":
                    ch_id = payload.get("channelId")
                    channels = [c for c in channels if c.get("id") != ch_id]

                data["community_channels"] = channels
                save_data(data)
                resp = json.dumps({"success": True, "channels": channels}).encode("utf-8")
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

        elif self.path.startswith("/api/community/members"):
            try:
                payload = json.loads(body)
                caller = (payload.get("adminEmail") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can manage community members")
                    return

                action = payload.get("action", "")
                members = data.get("community_members", [])

                if action == "add":
                    new_mem = payload.get("member", {})
                    if not new_mem.get("id"):
                        new_mem["id"] = "mem_" + uuid.uuid4().hex[:8]
                    members.append(new_mem)
                elif action == "update_title":
                    mem_id = payload.get("memberId")
                    new_title = (payload.get("newTitle") or payload.get("role") or "").strip()
                    for m in members:
                        if m.get("id") == mem_id or m.get("email") == mem_id or m.get("name") == mem_id:
                            m["role"] = new_title
                            if "coach" in new_title.lower() or "mentor" in new_title.lower():
                                m["roleType"] = "coach"
                            elif "admin" in new_title.lower() or "manager" in new_title.lower():
                                m["roleType"] = "staff"
                            break
                elif action == "remove":
                    mem_id = payload.get("memberId")
                    members = [m for m in members if m.get("id") != mem_id and m.get("name") != mem_id]

                data["community_members"] = members
                save_data(data)
                resp = json.dumps({"success": True, "members": members}).encode("utf-8")
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
                caller = (payload.get("adminEmail") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can edit video titles")
                    return

                vid_id = payload.get("id")
                new_title = payload.get("title")
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
                caller = (payload.get("adminEmail") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can delete videos")
                    return

                vid_id = payload.get("id")
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
                data = load_data()
                caller = self.headers.get("X-User-Email", "").strip().lower()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can import videos")
                    return

                imported = json.loads(body)
                if isinstance(imported, dict) and "videos" in imported:
                    imported = imported["videos"]
                if isinstance(imported, list):
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

        elif self.path.startswith("/api/youtube/categories"):
            try:
                data = load_data()
                caller = self.headers.get("X-User-Email", "").strip().lower()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can update playlist categories")
                    return

                payload = json.loads(body)
                cats = payload if isinstance(payload, list) else payload.get("categories", [])
                data["playlist_categories"] = cats
                save_data(data)
                resp = json.dumps({"success": True, "categories": cats}).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"success": False, "error": str(e)}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            return

        elif self.path.startswith("/api/youtube/playlist/import"):
            try:
                payload = json.loads(body)
                caller = (payload.get("adminEmail") or self.headers.get("X-User-Email", "") or "").strip().lower()
                data = load_data()
                if not is_admin_email(caller, data):
                    self.send_error(403, "Forbidden: Only administrator can import playlists")
                    return

                url = payload.get("url", "")
                cat_id = payload.get("categoryId", "")
                cat_title_override = (payload.get("categoryTitle") or "").strip()
                cat_flag_override = (payload.get("categoryFlag") or "").strip()
                vid_type = payload.get("videoType", "videos")
                create_category = payload.get("createCategory", False)
                
                result = fetch_youtube_playlist(url)
                if not result.get("success"):
                    resp = json.dumps(result).encode("utf-8")
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.send_header("Content-Length", str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return
                
                pl_videos = result.get("videos", [])
                pl_title = result.get("playlistTitle", "YouTube Playlist")
                
                data = load_data()
                new_cat_obj = None

                if create_category or not cat_id or cat_id == "new":
                    import re
                    chosen_title = cat_title_override or pl_title
                    chosen_flag = cat_flag_override or ("⚡" if vid_type == "shorts" else "🎬")
                    slug = re.sub(r'[^a-zA-Z0-9]+', '_', chosen_title.lower()).strip('_')[:20]
                    cat_id = f"custom_pl_{int(time.time())}_{slug}"
                    
                    custom_cats = data.get("playlist_categories", [])
                    new_cat_obj = {
                        "id": cat_id,
                        "type": vid_type,
                        "flag": chosen_flag,
                        "title": chosen_title,
                        "count": f"{len(pl_videos)} {'Shorts' if vid_type == 'shorts' else 'Videos'}"
                    }
                    if not any(c.get("id") == cat_id for c in custom_cats):
                        custom_cats.append(new_cat_obj)
                        data["playlist_categories"] = custom_cats

                new_videos = []
                now = int(time.time() * 1000)
                for idx, v in enumerate(pl_videos):
                    new_vid = {
                        "id": f"custom_{now}_{idx}_{v['videoId'][:8]}",
                        "categoryId": cat_id,
                        "title": v["title"],
                        "desc": f"Imported from playlist: {pl_title}",
                        "embedUrl": v["embedUrl"],
                        "thumbUrl": v["thumbUrl"],
                        "isUserAdded": True,
                        "addedAt": now + idx,
                        "videoType": vid_type
                    }
                    new_videos.append(new_vid)
                
                existing = data.get("videos", [])
                existing_urls = {item.get("embedUrl") for item in existing if isinstance(item, dict)}
                to_add = [v for v in new_videos if v["embedUrl"] not in existing_urls]
                
                data["videos"] = existing + to_add
                save_data(data)
                save_permanent_videos(data["videos"])
                
                resp = json.dumps({
                    "success": True,
                    "count": len(to_add),
                    "total": len(new_videos),
                    "playlistTitle": pl_title,
                    "categoryId": cat_id,
                    "category": new_cat_obj,
                    "videos": to_add
                }).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
            except Exception as e:
                resp = json.dumps({"success": False, "error": str(e)}).encode("utf-8")
                self.send_response(500)
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

        elif path.startswith("/api/youtube/categories"):
            query = urllib.parse.parse_qs(parsed_url.query)
            caller = (query.get("adminEmail", [None])[0] or query.get("email", [None])[0] or self.headers.get("X-User-Email", "") or "").strip().lower()
            data = load_data()
            if not is_admin_email(caller, data):
                self.send_error(403, "Forbidden: Only administrator can delete playlist categories")
                return

            cat_id = query.get("id", [None])[0]
            if not cat_id:
                parts = path.strip("/").split("/")
                if len(parts) >= 4:
                    cat_id = parts[3]
            
            if not cat_id:
                resp = json.dumps({"success": False, "error": "Missing category id"}).encode("utf-8")
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return

            cats = [c for c in data.get("playlist_categories", []) if c.get("id") != cat_id]
            data["playlist_categories"] = cats

            deleted_ids = data.get("deleted_playlist_categories", [])
            if cat_id not in deleted_ids:
                deleted_ids.append(cat_id)
            data["deleted_playlist_categories"] = deleted_ids

            videos = [v for v in data.get("videos", []) if v.get("categoryId") != cat_id]
            data["videos"] = videos

            save_data(data)

            resp = json.dumps({
                "success": True,
                "deletedCategoryId": cat_id,
                "categories": cats
            }).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(resp)))
            self.end_headers()
            self.wfile.write(resp)
            return

        self.send_error(404, "Not Found")

if __name__ == "__main__":
    os.chdir(BASE_DIR)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    local_ip = get_local_ip()
    with socketserver.ThreadingTCPServer(("", PORT), CustomHandler) as httpd:
        print("\n" + "=" * 60)
        print("  GLOBALLY KNOWN SERVER RUNNING & READY!")
        print(f"  Laptop/PC URL:  http://localhost:{PORT}")
        print(f"  Mobile Phone:   http://{local_ip}:{PORT}")
        print("=" * 60 + "\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
