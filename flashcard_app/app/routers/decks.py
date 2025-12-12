from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Lấy get_db đúng
from app.db.session import get_db

# Import tổng models
from app.models import all_models

# Schema
from app.schemas import flashcard

router = APIRouter(prefix="/decks", tags=["Decks & Cards"])

@router.post("/", response_model=flashcard.DeckOut)
def create_deck(deck: flashcard.DeckCreate, db: Session = Depends(get_db)):
    new_deck = all_models.Deck(
        **deck.dict(),
        user_id=1
    )
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    return new_deck


@router.get("/", response_model=List[flashcard.DeckOut])
def get_decks(db: Session = Depends(get_db)):
    return db.query(all_models.Deck).all()


@router.post("/{deck_id}/cards", response_model=flashcard.CardOut)
def add_card(deck_id: int, card: flashcard.CardCreate, db: Session = Depends(get_db)):
    deck = db.query(all_models.Deck).filter(all_models.Deck.id == deck_id).first()

    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")

    new_card = all_models.Card(
        **card.dict(),
        deck_id=deck_id
    )

    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card

