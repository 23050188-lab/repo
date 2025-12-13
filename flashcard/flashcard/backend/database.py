from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# =====================
# DATABASE CONFIG
# =====================
DATABASE_URL = "postgresql://student:123456@localhost:5432/flashcard"

# =====================
# ENGINE
# =====================
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # tự động reconnect nếu mất kết nối
)

# =====================
# SESSION
# =====================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# =====================
# BASE MODEL
# =====================
Base = declarative_base()
