from pydantic import BaseModel

class CardBase(BaseModel):
    front_text: str
    back_text: str

class CardCreate(CardBase):
    deck_id: int

class CardResponse(CardBase):
    id: int
    deck_id: int

    class Config:
        from_attributes = True

