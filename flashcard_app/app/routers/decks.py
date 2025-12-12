from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import all_models

# Import schema đúng
from app.schemas.deck_schema import DeckCreate, DeckResponse
from app.schemas.card_schema import CardCreate, CardResponse

router = APIRouter(prefix="/decks", tags=["Decks & Cards"])

# 1. Tạo bộ thẻ mới
@router.post("/", response_model=DeckResponse)
def create_deck(deck_in: DeckCreate, db: Session = Depends(get_db)):
    new_deck = all_models.Deck(**deck_in.dict(), user_id=1)  # sửa owner_id -> user_id nếu model dùng user_id
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    return new_deck

# 2. Lấy danh sách tất cả bộ thẻ
@router.get("/", response_model=list[DeckResponse])
def get_decks(db: Session = Depends(get_db)):
    return db.query(all_models.Deck).all()

# 3. Thêm thẻ vào bộ
@router.post("/{deck_id}/cards", response_model=CardResponse)
def add_card(deck_id: int, card_in: CardCreate, db: Session = Depends(get_db)):
    deck_obj = db.query(all_models.Deck).filter(all_models.Deck.id == deck_id).first()
    if not deck_obj:
        raise HTTPException(status_code=404, detail="Deck not found")

    new_card = all_models.Card(**card_in.dict(), deck_id=deck_id)
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card
