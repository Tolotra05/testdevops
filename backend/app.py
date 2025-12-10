from flask import Flask, jsonify, request
import sqlite3
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'app.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)''')
    
    users = [('admin', 'admin123'), ('demo', 'demo123'), ('test', 'test123')]
    for username, password in users:
        c.execute('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', (username, password))
    
    conn.commit()
    conn.close()
    print(f"✅ Database initialized at {DB_PATH}")

@app.route('/')
def home():
    return jsonify({
        "message": "Backend API is running",
        "status": "ok",
        "version": "1.0.0"
    })

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"status": "error", "message": "Username and password required"}), 400
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = c.fetchone()
        conn.close()
        
        if user and user[2] == password:
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "username": username
            })
        else:
            return jsonify({"status": "error", "message": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "backend",
        "timestamp": "2024"
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT id, username FROM users")
    users = c.fetchall()
    conn.close()
    
    users_list = [{"id": u[0], "username": u[1]} for u in users]
    return jsonify({"users": users_list, "count": len(users_list)})

if __name__ == '__main__':
    print("🚀 Starting Simple Backend...")
    init_db()
    print("📊 Database ready")
    print("🌐 Server starting on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)