from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()

@router.post("/")
def log_study(data: dict, db: Session = Depends(get_db)):
    return {"message": "Study logged"}
