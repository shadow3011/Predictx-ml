import sqlite3
import sys
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'instance', 'users.db')

def get_conn():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database not found at {DB_PATH}")
        sys.exit(1)
    return sqlite3.connect(DB_PATH)

def list_users():
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email FROM user")
    users = cursor.fetchall()
    print("\n--- Registered Users ---")
    print(f"{'ID':<5} | {'Username':<15} | {'Email':<25}")
    print("-" * 50)
    for u in users:
        print(f"{u[0]:<5} | {u[1]:<15} | {u[2]:<25}")
    conn.close()

def delete_user(username):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user WHERE username = ?", (username,))
    conn.commit()
    if cursor.rowcount > 0:
        print(f"Successfully deleted user: {username}")
    else:
        print(f"User '{username}' not found.")
    conn.close()

def reset_db():
    confirm = input("Are you sure you want to delete ALL users? (y/N): ")
    if confirm.lower() == 'y':
        conn = get_conn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM user")
        conn.commit()
        print("Database has been reset (all users deleted).")
        conn.close()

if __name__ == "__main__":
    print("PredictX Database Manager")
    print("1. List Users")
    print("2. Delete User")
    print("3. Reset Database (Delete All)")
    
    choice = input("\nEnter choice (1-3): ")
    
    if choice == '1':
        list_users()
    elif choice == '2':
        uname = input("Enter username to delete: ")
        delete_user(uname)
    elif choice == '3':
        reset_db()
    else:
        print("Invalid choice.")
