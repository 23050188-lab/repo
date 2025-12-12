from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    front_text = Column(String(500), nullable=False)
    back_text = Column(String(500), nullable=False)

    next_review_date = Column(DateTime, default=func.now())
    interval = Column(Integer, default=1)
    ease_factor = Column(Float, default=2.5)
    review_count = Column(Integer, default=0)

    deck_id = Column(Integer, ForeignKey("decks.id"))
    deck = relationship("Deck", back_populates="cards")
