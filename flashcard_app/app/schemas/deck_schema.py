from pydantic import BaseModel
from typing import Optional

# Schema khi tạo Deck (client gửi lên)
class DeckCreate(BaseModel):
    title: str
    description: Optional[str] = None

# Schema khi server trả về Deck
class DeckResponse(DeckCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
