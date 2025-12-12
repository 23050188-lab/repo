from pydantic import BaseModel, Field

class CardReviewInput(BaseModel):
    quality: int = Field(..., ge=0, le=5, description="Điểm đánh giá độ nhớ (0-5)")
