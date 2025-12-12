from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
# 1. CẤU HÌNH KẾT NỐI MYSQL (Dùng cho XAMPP)
DB_HOST = "127.0.0.1"
DB_USER = "admin"
DB_PASSWORD = "123456"
DB_PORT = "3306"
DB_NAME = "flashcard_db"
# 2. CHUỖI KẾT NỐI (Dùng driver pymysql)
# Cấu trúc: mysql+pymysql://user:password@host:port/dbname
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
# 3. TẠO ENGINE
# Lưu ý quan trọng: Đã XÓA tham số 'fast_executemany=True' (vì cái này chỉ dành cho SQL Server)
engine = create_engine(SQLALCHEMY_DATABASE_URL)
# 4. TẠO SESSION
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 5. TẠO BASE CHO MODELS
Base = declarative_base()
# 6. HÀM DEPENDENCY (Để dùng trong các router)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
