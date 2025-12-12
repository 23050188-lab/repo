from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from flashcard_app.app.db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password_hash = Column(String(200)) # Lưu mật khẩu đã mã hóa
    
    decks = relationship("Deck", back_populates="owner")

class Deck(Base):
    __tablename__ = "decks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="decks")
    cards = relationship("Card", back_populates="deck", cascade="all, delete-orphan")

class Card(Base):
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    front = Column(Text, nullable=False) # Từ vựng
    back = Column(Text, nullable=False)  # Nghĩa/Ví dụ
    deck_id = Column(Integer, ForeignKey("decks.id"))

    # --- CÁC TRƯỜNG PHỤC VỤ THUẬT TOÁN SPACED REPETITION ---
    repetition = Column(Integer, default=0)       # Số lần nhớ liên tiếp
    interval = Column(Integer, default=1)         # Khoảng cách ngày (days)
    easiness = Column(Float, default=2.5)         # Hệ số dễ (E-Factor)
    next_review = Column(DateTime, default=datetime.now) # Ngày cần ôn lại

    deck = relationship("Deck", back_populates="cards")