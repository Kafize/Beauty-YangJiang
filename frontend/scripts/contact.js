document.addEventListener('DOMContentLoaded', function() {
    // 获取表单元素
    const contactForm = document.querySelector('.contact-form');
    const submitButton = document.querySelector('.submit-button');

    // 表单提交处理
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 显示加载动画
        submitButton.classList.add('loading');
        
        // 收集表单数据
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // 模拟API请求
        setTimeout(() => {
            // 移除加载动画
            submitButton.classList.remove('loading');
            
            // 显示成功消息
            showSuccessMessage();
            
            // 重置表单
            contactForm.reset();
        }, 1500);
    });

    // 显示成功消息
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>消息已成功发送！我们会尽快回复您。</p>
        `;
        
        // 添加样式
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.5s ease forwards;
        `;

        document.body.appendChild(successMessage);

        // 3秒后移除消息
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => {
                successMessage.remove();
            }, 500);
        }, 3000);
    }

    // 添加动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 表单验证
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        });
    });

    // 地图交互
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        mapContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}); 