import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    
    # MySQL Database credentials
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_USER = os.getenv('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_DB = os.getenv('MYSQL_DB', 'resume_builder_db')
    
    # Priority: DB_URI if provided -> MySQL connection -> fallback SQLite
    CUSTOM_DB_URI = os.getenv('DATABASE_URL')
    
    if CUSTOM_DB_URI:
        SQLALCHEMY_DATABASE_URI = CUSTOM_DB_URI
    else:
        # Check if MySQL can be targeted, otherwise SQLite for immediate zero-config execution
        USE_SQLITE_FALLBACK = os.getenv('USE_SQLITE_FALLBACK', 'true').lower() in ('true', '1', 'yes')
        if not os.getenv('MYSQL_PASSWORD') and USE_SQLITE_FALLBACK:
            basedir = os.path.abspath(os.path.dirname(__file__))
            SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'resume_builder.db')}"
        else:
            SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # AI configuration
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
