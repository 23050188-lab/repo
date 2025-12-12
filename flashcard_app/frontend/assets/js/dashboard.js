document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra đăng nhập
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Hiển thị tên người dùng (Lấy từ localStorage đã lưu bên auth.js)
    const savedName = localStorage.getItem('username');
    if (savedName) {
        // Tìm element có id="username-display" để gán tên
        const nameElement = document.getElementById('username-display');
        if (nameElement) nameElement.innerText = savedName;
    }

    // 3. Tải danh sách bộ thẻ
    loadDecks();
});

// --- Logic Sidebar ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
}

// --- Logic Tải dữ liệu ---
async function loadDecks() {
    try {
        const res = await authFetch('/decks/');
        if (res.ok) {
            const decks = await res.json();
            renderDecks(decks);
            
            // Cập nhật thống kê nhanh (Demo)
            const countElement = document.getElementById('due-count');
            if (countElement) {
                countElement.innerText = `${decks.length * 5} thẻ`; 
            }
        }
    } catch (e) { console.error("Lỗi tải decks:", e); }
}

// --- Logic Render HTML ---
function renderDecks(decks) {
    const container = document.getElementById('decks-container');
    container.innerHTML = '';
    
    if (decks.length === 0) {
        container.innerHTML = '<p style="color: #6b7280; font-style: italic;">Chưa có bộ thẻ nào. Hãy tạo mới!</p>';
        return;
    }

    decks.forEach(deck => {
        // Lưu ý: onclick truyền vào ID của deck để biết chọn học bài nào
        const html = `
            <div class="deck-card" onclick="goToStudy(${deck.id})">
                <div class="deck-title">${deck.title}</div>
                <div class="deck-meta">
                    <i class="fas fa-layer-group"></i> ${deck.description || 'Không có mô tả'}
                </div>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: #6b7280;">
                    <i class="fas fa-user"></i> By Me
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

// --- Logic Modal & Tạo Deck ---
function openModal() { 
    document.getElementById('create-modal').classList.add('active'); 
}

function closeModal() { 
    document.getElementById('create-modal').classList.remove('active'); 
}

async function createDeck() {
    const title = document.getElementById('deck-title').value;
    const desc = document.getElementById('deck-desc').value;

    if (!title.trim()) return alert("Vui lòng nhập tên bộ thẻ!");

    try {
        const res = await authFetch('/decks/', {
            method: 'POST',
            body: JSON.stringify({ title: title, description: desc })
        });
        
        if (res.ok) {
            // Reset form và đóng modal
            document.getElementById('deck-title').value = '';
            document.getElementById('deck-desc').value = '';
            closeModal();
            loadDecks(); // Tải lại danh sách để thấy deck mới
        } else {
            alert('Lỗi khi tạo bộ thẻ');
        }
    } catch (error) {
        console.error(error);
        alert('Không thể kết nối server');
    }
}

// --- Chuyển trang ---

// Khi click vào bộ thẻ, lưu ID lại để trang study biết học bộ nào
function goToStudy(deckId) { 
    if (deckId) {
        localStorage.setItem('current_deck_id', deckId);
    }
    window.location.href = 'study.html'; 
}

function logout() { 
    localStorage.removeItem('access_token'); 
    localStorage.removeItem('username');
    localStorage.removeItem('current_deck_id');
    window.location.href = 'index.html'; 
}