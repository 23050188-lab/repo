from datetime import datetime, timedelta
from app.models.all_models import Card

def calculate_sm2(card: Card, quality: int):
    """
    Thuật toán SuperMemo-2 (SM-2):
    - input: Card object, quality (0-5)
    - output: Cập nhật card với ngày ôn tiếp theo mới
    """
    if quality >= 3: # Nếu người dùng nhớ (điểm >= 3)
        if card.repetition == 0:
            card.interval = 1
        elif card.repetition == 1:
            card.interval = 6
        else:
            # interval mới = interval cũ * hệ số dễ
            card.interval = int(card.interval * card.easiness)
        
        card.repetition += 1
        # Công thức cập nhật Easiness Factor
        new_easiness = card.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        card.easiness = max(1.3, new_easiness) # E-Factor không được nhỏ hơn 1.3
    
    else: # Nếu quên (quality < 3)
        card.repetition = 0
        card.interval = 1 # Reset về học lại vào ngày mai
    
    # Tính ngày ôn tiếp theo
    card.next_review = datetime.now() + timedelta(days=card.interval)
    
    return card