from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db

# --- QUAN TRỌNG: PHẢI CÓ DÒNG NÀY ---
router = APIRouter()
# ------------------------------------

# Ví dụ một API trong file này (Lưu ý dùng @router)
@router.post("/")
def study_log(log_data: dict, db: Session = Depends(get_db)):
    # Code xử lý việc học (study) ở đây
    return {"message": "Study log recorded"}
