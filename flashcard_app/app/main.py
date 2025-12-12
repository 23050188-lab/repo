from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import Session và Base từ đúng chỗ (theo cấu trúc mới của bạn)
from app.db.session import engine 
from app.db.base import Base

# 2. Import Router tổng (Cái ổ cắm nối dài)
from app.api.v1.api import api_router

# Tạo bảng database
Base.metadata.create_all(bind=engine)

# Khởi tạo App (Điền trực tiếp tên, không dùng settings nữa cho đỡ lỗi)
app = FastAPI(
    title="Flashcard App",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs"
)

# Cấu hình CORS (Cho phép Frontend gọi vào)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ĐÂY LÀ DÒNG BẠN THẮC MẮC ---
# Thay vì dùng settings.API_V1_STR, ta điền thẳng "/api/v1"
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Welcome to TFlashcard API", "docs": "/docs"}
