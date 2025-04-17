// 标签页切换功能
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const authForms = document.querySelectorAll('.auth-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));

            // 添加active类到当前按钮和对应表单
            button.classList.add('active');
            const formId = `${button.getAttribute('data-tab')}-form`;
            document.getElementById(formId).classList.add('active');
        });
    });
});

// 获取DOM元素
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const closeButtons = document.querySelectorAll('.close');
    const authButtons = document.querySelector('.auth-buttons');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    // 打开模态框
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // 关闭模态框
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 更新UI以反映登录状态
    function updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        // 强制显示auth-buttons
        authButtons.style.display = 'flex';

        // 如果mockData还没有准备好，显示默认的登录注册按钮
        if (!window.mockData || !window.mockData.api || !window.mockData.api.auth) {
            authButtons.innerHTML = `
                <button id="loginBtn" class="btn btn-outline">登录</button>
                <button id="registerBtn" class="btn btn-primary">注册</button>
            `;
            
            // 绑定按钮事件
            const loginBtn = document.getElementById('loginBtn');
            const registerBtn = document.getElementById('registerBtn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    openModal(loginModal);
                });
            }
            
            if (registerBtn) {
                registerBtn.addEventListener('click', () => {
                    openModal(registerModal);
                });
            }
            return;
        }

        // 尝试获取当前用户状态
        window.mockData.api.auth.getCurrentUser()
            .then(user => {
                // 用户已登录
                authButtons.innerHTML = `
                    <span class="username">${user.name}</span>
                    <button id="logoutBtn" class="btn btn-outline">退出</button>
                `;
                
                // 添加退出按钮事件监听
                const logoutBtn = document.getElementById('logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => {
                        window.mockData.api.auth.logout().then(() => {
                            window.location.reload();
                        });
                    });
                }
            })
            .catch(() => {
                // 用户未登录，显示默认的登录注册按钮
                authButtons.innerHTML = `
                    <button id="loginBtn" class="btn btn-outline">登录</button>
                    <button id="registerBtn" class="btn btn-primary">注册</button>
                `;
                
                // 重新绑定登录注册按钮事件
                const loginBtn = document.getElementById('loginBtn');
                const registerBtn = document.getElementById('registerBtn');
                
                if (loginBtn) {
                    loginBtn.addEventListener('click', () => {
                        openModal(loginModal);
                    });
                }
                
                if (registerBtn) {
                    registerBtn.addEventListener('click', () => {
                        openModal(registerModal);
                    });
                }
            });
    }

    // 登录按钮点击事件
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            openModal(loginModal);
        });
    }

    // 注册按钮点击事件
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            openModal(registerModal);
        });
    }

    // 关闭按钮点击事件
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(registerModal);
        });
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    // 模态框切换事件
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // 登录表单提交
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                await window.mockData.api.auth.login({ email, password });
                showMessage('登录成功！');
                closeModal(loginModal);
                updateAuthUI(); // 更新UI状态
            } catch (error) {
                showError('loginForm', error.message || '登录失败，请重试');
            }
        });
    }

    // 注册表单提交
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showError('registerForm', '两次输入的密码不一致');
                return;
            }

            try {
                await window.mockData.api.auth.register({ username, email, password });
                showMessage('注册成功！请登录');
                closeModal(registerModal);
                openModal(loginModal);
            } catch (error) {
                showError('registerForm', error.message || '注册失败，请重试');
            }
        });
    }

    // 初始化检查登录状态
    updateAuthUI();
});

// 显示消息提示
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // 3秒后移除消息
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
}

// 显示错误信息
function showError(formId, message) {
    const form = document.getElementById(formId);
    let errorDiv = form.querySelector('.error-message');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        form.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    // 3秒后隐藏错误信息
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
} 