import os

class Settings:
    PROJECT_NAME: str = "TFlashcard"
    
    # MÃ BÍ MẬT: Dùng để ký Token. 
    # Trong thực tế phải giấu kỹ, không được lộ ra ngoài.
    # Bạn có thể đổi chuỗi này thành bất cứ gì bạn muốn.
    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # Token sống trong 24 giờ
    
    # Cấu hình Database
    # Nếu trong file .env có biến DATABASE_URL thì lấy, không thì dùng default bên dưới
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+mysqlconnector://root:password@localhost/tflashcard_db"
    )

settings = Settings()