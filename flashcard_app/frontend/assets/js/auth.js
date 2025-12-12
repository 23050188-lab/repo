// Kiểm tra nếu đã đăng nhập rồi thì đá sang Dashboard luôn
if (localStorage.getItem('access_token')) {
    window.location.href = 'dashboard.html';
}

const loginForm = document.getElementById('login-form');
const errorBox = document.getElementById('error-box');
const errorText = document.getElementById('error-text');
const btnLogin = document.getElementById('btn-login');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Hiệu ứng loading
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    errorBox.style.display = 'none';

    // 2. Lấy dữ liệu
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 3. Chuẩn bị FormData (FastAPI OAuth2 yêu cầu x-www-form-urlencoded)
    // Lưu ý: Không gửi JSON mà gửi URLSearchParams
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
        // 4. Gọi API
        const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            // 5. Đăng nhập thành công
            // Lưu token
            localStorage.setItem('access_token', data.access_token);
            // Có thể lưu thêm username để hiển thị
            localStorage.setItem('username', username); 
            
            // Chuyển hướng
            window.location.href = 'dashboard.html';
        } else {
            // 6. Xử lý lỗi từ server (VD: Sai pass)
            showError(data.detail || 'Đăng nhập thất bại');
        }

    } catch (error) {
        console.error('Login Error:', error);
        showError('Không thể kết nối đến máy chủ. Hãy kiểm tra Backend.');
    } finally {
        // Reset nút bấm
        btnLogin.disabled = false;
        btnLogin.innerText = 'Đăng nhập';
    }
});

function showError(message) {
    errorText.innerText = message;
    errorBox.style.display = 'block';
}