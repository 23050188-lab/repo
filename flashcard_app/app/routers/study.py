from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()

@router.post("/")
def study_log(log_data: dict, db: Session = Depends(get_db)):
    if not log_data:
        raise HTTPException(status_code=400, detail="No study data provided")

    return {"message": "Study log recorded", "data": log_data}
