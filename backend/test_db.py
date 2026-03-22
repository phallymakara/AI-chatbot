import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

conn_str = f"""
DRIVER={{ODBC Driver 18 for SQL Server}};
SERVER={DB_SERVER};
DATABASE={DB_NAME};
UID={DB_USER};
PWD={DB_PASSWORD};
Encrypt=yes;
TrustServerCertificate=no;
Connection Timeout=30;
"""

try:
    conn = pyodbc.connect(conn_str)
    print("✅ Connected successfully!")
except Exception as e:
    print("❌ Error:", e)