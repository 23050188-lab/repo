from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.config import settings # Bạn cần file config chứa SECRET_KEY
from app.models.user import User

# Url để lấy token (khớp với router login)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# Hàm lấy DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hàm lấy User hiện tại từ Token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Giải mã Token (SECRET_KEY phải khớp với lúc tạo token)
        payload = jwt.decode(token, "SECRET_KEY_CUA_BAN", algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user