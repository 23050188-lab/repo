from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
# --- QUAN TRỌNG: PHẢI CÓ DÒNG NÀY ---
router = APIRouter()
# ------------------------------------
from ..db.database import get_db
# (Import thêm các schemas và models của bạn ở đây nếu thiếu)
# Ví dụ: from ...schemas import deck as deck_schema
# --- SỬA CÁC DECORATOR ---
# Lưu ý: Ở đây phải dùng @router.get chứ KHÔNG dùng @app.get
@router.post("/decks/", response_model=dict) # Ví dụ
def create_deck(deck: dict, db: Session = Depends(get_db)):
    # Code xử lý của bạn...
    return {"message": "Deck created"}
@router.get("/decks/", response_model=list)
def read_decks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # Code xử lý của bạn...
    return []
