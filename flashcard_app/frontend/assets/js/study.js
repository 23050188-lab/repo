let dueCards = [];
let currentIndex = 0;
let isFlipped = false;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Gọi API lấy thẻ cần học
    const res = await authFetch('/study/due');
    if (res.ok) {
        dueCards = await res.json();
        updateUI();
    }
});

function updateUI() {
    if (dueCards.length === 0 || currentIndex >= dueCards.length) {
        document.querySelector('.study-container').innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 3rem;">🎉</h1>
                <h2>Xuất sắc!</h2>
                <p>Bạn đã hoàn thành bài học hôm nay.</p>
                <a href="dashboard.html" class="btn btn-primary" style="margin: 20px auto; width: fit-content;">Về trang chủ</a>
            </div>
        `;
        return;
    }

    const card = dueCards[currentIndex];
    document.getElementById('card-front-text').innerText = card.front_text;
    document.getElementById('card-back-text').innerText = card.back_text;
    
    // Reset trạng thái thẻ
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('is-flipped');
    isFlipped = false;
    toggleControls(false);

    // Cập nhật thanh tiến độ
    const percent = ((currentIndex) / dueCards.length) * 100;
    document.getElementById('progress-fill').style.width = `${percent}%`;
    document.getElementById('progress-text').innerText = `Tiến độ: ${currentIndex}/${dueCards.length}`;
}

// 2. Hàm lật thẻ (State: flippedCard)
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    isFlipped = !isFlipped;
    
    if (isFlipped) {
        flashcard.classList.add('is-flipped');
        toggleControls(true);
    } else {
        flashcard.classList.remove('is-flipped');
        toggleControls(false);
    }
}

function toggleControls(show) {
    const controls = document.getElementById('rating-controls');
    controls.style.opacity = show ? '1' : '0';
    controls.style.pointerEvents = show ? 'auto' : 'none';
}

// 3. Xử lý đánh giá (Submit Review)
async function submitReview(e, quality) {
    e.stopPropagation(); // Ngăn click xuyên qua thẻ làm lật lại
    
    const cardId = dueCards[currentIndex].id;
    try {
        await authFetch(`/study/review/${cardId}`, {
            method: 'POST',
            body: JSON.stringify({ quality })
        });
        
        // Chuyển sang thẻ tiếp theo
        currentIndex++;
        updateUI();
    } catch (err) {
        alert('Lỗi kết nối server');
    }
}

// 4. Update Goal (Tính năng phụ từ React file)
function updateGoal(val) {
    document.getElementById('goal-display').innerText = val;
}