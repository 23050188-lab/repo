/**
 * API CLIENT - PHIÊN BẢN CUỐI CÙNG
 * Kết hợp ưu điểm của cả Class-based và Functional
 * Compatible với cả 2 backend versions
 */

class APIClient {
    constructor() {
        // [CONFIG] Đổi sang IP máy ảo Oracle nếu cần
        this.baseURL = 'http://127.0.0.1:8000'; 
        this.tokenKey = 'access_token';
        this.userKey = 'user_info';
    }

    // ============ TOKEN MANAGEMENT ============
    
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    getUserInfo() {
        const data = localStorage.getItem(this.userKey);
        return data ? JSON.parse(data) : null;
    }

    setUserInfo(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    clearAuth() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    // ============ CORE REQUEST ============
    
    getHeaders(includeAuth = true) {
        const headers = {};
        if (includeAuth) {
            const token = this.getToken();
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') 
            ? endpoint 
            : `${this.baseURL}${endpoint}`;
        
        const config = {
            method: options.method || 'GET',
            headers: {
                ...this.getHeaders(options.requireAuth !== false),
                ...options.headers
            }
        };

        // Handle body
        if (options.body) {
            if (options.body instanceof URLSearchParams) {
                // Form data - không set Content-Type, browser tự động
                config.body = options.body;
            } else if (typeof options.body === 'string') {
                config.body = options.body;
                if (!config.headers['Content-Type']) {
                    config.headers['Content-Type'] = 'application/json';
                }
            } else {
                // Object -> JSON
                config.body = JSON.stringify(options.body);
                config.headers['Content-Type'] = 'application/json';
            }
        }

        try {
            const response = await fetch(url, config);
            
            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.logout();
                throw new Error('Phiên đăng nhập hết hạn.');
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
} else {
                data = await response.text();
            }

            if (!response.ok) {
                const errorMsg = data.detail || data || `Lỗi ${response.status}`;
                throw new Error(errorMsg);
            }

            return data;

        } catch (error) {
            console.error(`❌ API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // ============ AUTHENTICATION ============
    
    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const data = await this.request('/auth/login', {
            method: 'POST',
            body: formData,
            requireAuth: false
        });

        this.setToken(data.access_token);
        
        // Lưu user info
        const userInfo = data.user || { username };
        this.setUserInfo(userInfo);

        return data;
    }

    async register(username, password, email, fullName) {
        return this.request('/auth/register', {
            method: 'POST',
            body: { username, password, email, full_name: fullName },
            requireAuth: false
        });
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    logout() {
        this.clearAuth();
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
            window.location.href = 'login.html';
        }
    }

    // ============ PROJECTS ============
    
    async getProjects() {
        return this.request('/projects/');
    }

    async createProject(name, description, hourlyRate = 0) {
        return this.request('/projects/', {
            method: 'POST',
            body: { name, description, hourly_rate: hourlyRate }
        });
    }

    async updateProject(projectId, data) {
        return this.request(`/projects/${projectId}`, {
            method: 'PUT',
            body: data
        });
    }

    async deleteProject(projectId) {
        return this.request(`/projects/${projectId}`, {
            method: 'DELETE'
        });
    }

    // ============ TASKS ============
    
    async getTasks(projectId = null) {
        const endpoint = projectId 
            ? `/tasks/?project_id=${projectId}` 
            : '/tasks/';
        return this.request(endpoint);
    }

    async createTask(taskData) {
        return this.request('/tasks/', {
            method: 'POST',
            body: taskData
        });
    }

    async updateTask(taskId, taskData) {
        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: taskData
        });
    }

    async deleteTask(taskId) {
        return this.request(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }

    // ============ TIME ENTRIES ============
    
    /**
* START TIMER - Tương thích với cả 2 endpoints:
     * - POST /time-entries/start (backend mới của bạn)
     * - POST /time-entries/ (backend cũ)
     */
    async startTimer(taskId, note = '') {
        try {
            // Thử endpoint /start trước (backend của bạn)
            return await this.request('/time-entries/start', {
                method: 'POST',
                body: { task_id: taskId, note }
            });
        } catch (error) {
            // Fallback về endpoint / (backend cũ)
            if (error.message.includes('404')) {
                return await this.request('/time-entries/', {
                    method: 'POST',
                    body: { task_id: taskId, note }
                });
            }
            throw error;
        }
    }

    /**
     * STOP TIMER - Tương thích với cả 2 endpoints:
     * - POST /time-entries/stop (không cần ID)
     * - PUT /time-entries/{id}/stop (cần ID)
     */
    async stopTimer(entryId = null) {
        if (entryId) {
            // Backend cũ - cần ID
            return await this.request(`/time-entries/${entryId}/stop`, {
                method: 'PUT'
            });
        } else {
            // Backend mới của bạn - không cần ID
            return await this.request('/time-entries/stop', {
                method: 'POST'
            });
        }
    }

    /**
     * GET CURRENT TIMER
     */
    async getCurrentTimer() {
        return await this.request('/time-entries/current');
    }

    /**
     * GET TIME ENTRIES with filters
     */
    async getTimeEntries(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString 
            ? `/time-entries/?${queryString}` 
            : '/time-entries/';
        return this.request(endpoint);
    }

    /**
     * GET SUMMARY - Endpoint mới của bạn
     */
    async getTimeSummary(startDate = null, endDate = null) {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        
        const endpoint = params.toString() 
            ? `/time-entries/summary?${params}` 
            : '/time-entries/summary';
        
        return this.request(endpoint);
    }

    /**
     * GET TODAY STATS - Fallback cho backend cũ
     */
    async getTodayStats() {
        try {
            // Thử dùng /summary trước
            const today = new Date().toISOString().split('T')[0];
            return await this.getTimeSummary(today, today);
        } catch (error) {
            // Fallback về /stats/today nếu có
            if (error.message.includes('404')) {
                return await this.request('/time-entries/stats/today');
            }
            throw error;
        }
    }

    /**
     * UPDATE TIME ENTRY
     */
    async updateTimeEntry(entryId, data) {
return this.request(`/time-entries/${entryId}`, {
            method: 'PUT',
            body: data
        });
    }

    /**
     * DELETE TIME ENTRY
     */
    async deleteTimeEntry(entryId) {
        return this.request(`/time-entries/${entryId}`, {
            method: 'DELETE'
        });
    }
}

// ============ GLOBAL INSTANCE ============
const api = new APIClient();

// ============ DEBUG INFO ============
console.log('✅ API Client v3.0 loaded');
console.log('📍 Backend URL:', api.baseURL);
console.log('🔑 Token:', api.getToken() ? 'Present' : 'Missing');

