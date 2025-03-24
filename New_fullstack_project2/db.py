import sqlite3

def connect_db():
    return sqlite3.connect("orders.db", check_same_thread=False)

def init_db():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS orders (
                        id TEXT PRIMARY KEY,
                        customer TEXT,
                        products TEXT,
                        total REAL)''')
    conn.commit()
    conn.close()
