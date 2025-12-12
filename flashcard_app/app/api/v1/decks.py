from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db

# --- DÒNG QUAN TRỌNG ĐANG THIẾU ---
router = APIRouter()
# ----------------------------------

@router.post("/")
def create_deck(deck: dict, db: Session = Depends(get_db)):
    return {"message": "Deck created"}

@router.get("/")
def read_decks(db: Session = Depends(get_db)):
    return [{"id": 1, "name": "Demo Deck"}]
