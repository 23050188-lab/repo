from fastapi import APIRouter
# Import các file nằm cùng thư mục (dùng dấu chấm)
from . import decks, study, cards, auth

# --- ĐÂY LÀ BIẾN MÀ MAIN.PY ĐANG TÌM KIẾM ---
api_router = APIRouter()
# --------------------------------------------

# Gom các router con vào
# Lưu ý: Nếu file nào (ví dụ auth.py) chưa viết code gì thì bạn thêm dấu # đằng trước để tạm ẩn đi
api_router.include_router(decks.router, prefix="/decks", tags=["decks"])
api_router.include_router(study.router, prefix="/study", tags=["study"])
api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
