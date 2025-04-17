// API基础配置
const API_BASE_URL = 'http://localhost:3000/api';

// 获取认证token
function getAuthToken() {
    return localStorage.getItem('token');
}

// 设置认证token
function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// 移除认证token
function removeAuthToken() {
    localStorage.removeItem('token');
}

// 获取当前用户信息
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// 设置当前用户信息
function setCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// 移除当前用户信息
function removeCurrentUser() {
    localStorage.removeItem('user');
}

// 通用请求函数
async function request(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '请求失败');
        }

        return await response.json();
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 将API函数暴露到window对象上
window.api = {
    getCurrentUser,
    setCurrentUser,
    removeCurrentUser,
    getAuthToken,
    setAuthToken,
    removeAuthToken,
    request,
    // 添加其他需要暴露的API函数
    login: async (credentials) => {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        return response;
    },
    register: async (userData) => {
        const response = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return response;
    },
    logout: () => {
        removeAuthToken();
        removeCurrentUser();
    },

    // 文件上传相关
    upload: {
        // 上传文件
        uploadFile: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            return request('/upload/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: formData
            });
        },

        // 下载文件
        downloadFile: async (filename) => {
            window.location.href = `${API_BASE_URL}/upload/download/${filename}`;
        },

        // 删除文件
        deleteFile: async (filename) => {
            return request(`/upload/${filename}`, {
                method: 'DELETE'
            });
        }
    },

    // 景点相关
    scenicSpots: {
        // 获取所有景点
        getAll: async () => {
            return request('/scenic-spots');
        },

        // 获取景点详情
        getById: async (id) => {
            return request(`/scenic-spots/${id}`);
        },

        // 创建景点
        create: async (spotData) => {
            return request('/scenic-spots', {
                method: 'POST',
                body: JSON.stringify(spotData)
            });
        },

        // 更新景点
        update: async (id, spotData) => {
            return request(`/scenic-spots/${id}`, {
                method: 'PUT',
                body: JSON.stringify(spotData)
            });
        },

        // 删除景点
        delete: async (id) => {
            return request(`/scenic-spots/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // 活动相关
    activities: {
        // 获取所有活动
        getAll: async () => {
            return request('/activities');
        },

        // 获取活动详情
        getById: async (id) => {
            return request(`/activities/${id}`);
        },

        // 创建活动
        create: async (activityData) => {
            return request('/activities', {
                method: 'POST',
                body: JSON.stringify(activityData)
            });
        },

        // 更新活动
        update: async (id, activityData) => {
            return request(`/activities/${id}`, {
                method: 'PUT',
                body: JSON.stringify(activityData)
            });
        },

        // 删除活动
        delete: async (id) => {
            return request(`/activities/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // 文章相关
    articles: {
        // 获取所有文章
        getAll: async () => {
            return request('/articles');
        },

        // 获取文章详情
        getById: async (id) => {
            return request(`/articles/${id}`);
        },

        // 创建文章
        create: async (articleData) => {
            return request('/articles', {
                method: 'POST',
                body: JSON.stringify(articleData)
            });
        },

        // 更新文章
        update: async (id, articleData) => {
            return request(`/articles/${id}`, {
                method: 'PUT',
                body: JSON.stringify(articleData)
            });
        },

        // 删除文章
        delete: async (id) => {
            return request(`/articles/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // 预订相关
    booking: {
        // 创建新预订
        createBooking: async (bookingData) => {
            // 模拟API调用
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 获取现有预订记录
                    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                    
                    // 添加新预订
                    const newBooking = {
                        id: Date.now(),
                        ...bookingData,
                        status: 'confirmed',
                        createTime: new Date().toISOString()
                    };
                    
                    bookings.push(newBooking);
                    
                    // 保存到localStorage
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    
                    resolve({
                        status: 'success',
                        data: newBooking
                    });
                }, 500);
            });
        },

        // 获取所有预订记录
        getAllBookings: async () => {
            // 模拟API调用
            return new Promise((resolve) => {
                setTimeout(() => {
                    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                    resolve({
                        status: 'success',
                        data: {
                            bookings: bookings
                        }
                    });
                }, 300);
            });
        },

        // 取消预订
        cancelBooking: async (bookingId) => {
            // 模拟API调用
            return new Promise((resolve) => {
                setTimeout(() => {
                    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                    
                    // 更新预订状态
                    bookings = bookings.map(booking => {
                        if (booking.id === bookingId) {
                            return { ...booking, status: 'cancelled' };
                        }
                        return booking;
                    });
                    
                    // 保存更新后的预订记录
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                    
                    resolve({
                        status: 'success'
                    });
                }, 500);
            });
        }
    }
}; 