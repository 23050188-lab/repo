const API_CONFIG = {
    baseURL: 'http://127.0.0.1:8000/api/v1', // Đổi URL nếu deploy
};

async function authFetch(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, { ...options, headers });
    if (response.status === 401) window.location.href = 'index.html';
    return response;
}
