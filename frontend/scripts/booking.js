// 标签页切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 标签页切换
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            tabPanes.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.add('active');
                    // 添加进入动画
                    pane.style.animation = 'fadeIn 0.5s ease';
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // 数字输入框控制
    const numberInputs = document.querySelectorAll('.number-input');
    
    numberInputs.forEach(container => {
        const input = container.querySelector('input');
        const minusBtn = container.querySelector('.minus');
        const plusBtn = container.querySelector('.plus');
        
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            if (currentValue > parseInt(input.min)) {
                input.value = currentValue - 1;
                triggerChange(input);
            }
        });
        
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(input.value);
            const max = input.hasAttribute('max') ? parseInt(input.max) : 99;
            if (currentValue < max) {
                input.value = currentValue + 1;
                triggerChange(input);
            }
        });
        
        input.addEventListener('change', () => {
            const value = parseInt(input.value);
            const min = parseInt(input.min);
            const max = input.hasAttribute('max') ? parseInt(input.max) : 99;
            
            if (value < min) input.value = min;
            if (value > max) input.value = max;
        });
    });

    // 日期输入限制
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach(input => {
        input.min = today;
    });

    // 酒店日期联动
    const checkInInputs = document.querySelectorAll('[id$="check-in"]');
    const checkOutInputs = document.querySelectorAll('[id$="check-out"]');
    
    checkInInputs.forEach((checkIn, index) => {
        const checkOut = checkOutInputs[index];
        
        checkIn.addEventListener('change', () => {
            const date = new Date(checkIn.value);
            date.setDate(date.getDate() + 1);
            checkOut.min = date.toISOString().split('T')[0];
            
            if (checkOut.value && checkOut.value <= checkIn.value) {
                checkOut.value = date.toISOString().split('T')[0];
            }
        });
    });

    // 图片轮播功能
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
        const images = [
            'images/svg/hotel1.svg',
            'images/svg/hotel2.svg',
            'images/svg/hotel3.svg'
        ];
        let currentIndex = 0;
        const img = gallery.querySelector('img');
        const prevBtn = gallery.querySelector('.prev');
        const nextBtn = gallery.querySelector('.next');
        
        function updateImage() {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = images[currentIndex];
                img.style.opacity = '1';
            }, 200);
        }
        
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        });
        
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        });
    });

    // 预订表单提交
    const bookingForms = document.querySelectorAll('form');
    
    bookingForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.book-now');
            if (!submitBtn) return;
            
            // 检查用户是否已登录
            if (!checkAuth()) return;
            
            // 添加加载状态
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            try {
                // 获取表单数据
                const formData = new FormData(form);
                const bookingData = {
                    type: form.id.includes('hotel') ? 'hotel' : 'ticket'
                };
                
                // 将FormData转换为对象
                for (let [key, value] of formData.entries()) {
                    bookingData[key] = value;
                }
                
                // 添加总价
                const priceElement = form.closest('.ticket-card, .hotel-card').querySelector('.price');
                if (priceElement) {
                    bookingData.totalPrice = parseFloat(priceElement.textContent.replace('¥', ''));
                }
                
                // 发送预订请求
                const response = await api.booking.createBooking(bookingData);
                
                if (response.status === 'success') {
                    alert('预订成功！我们将尽快处理您的订单。');
                    loadBookings(); // 刷新预订记录
                } else {
                    alert(response.message || '预订失败，请重试');
                }
            } catch (error) {
                console.error('预订失败:', error);
                alert('预订失败，请重试');
            } finally {
                // 移除加载状态
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    });
});

// 辅助函数：触发input change事件
function triggerChange(input) {
    const event = new Event('change', {
        bubbles: true,
        cancelable: true,
    });
    input.dispatchEvent(event);
}

// 价格计算功能
function calculateTotal(basePrice, quantity, options = {}) {
    let total = basePrice * quantity;
    
    // 应用可选项加价
    if (options.roomType) {
        switch (options.roomType) {
            case 'deluxe':
                total *= 1.2;
                break;
            case 'suite':
            case 'villa':
                total *= 1.5;
                break;
        }
    }
    
    // 应用日期范围
    if (options.checkIn && options.checkOut) {
        const start = new Date(options.checkIn);
        const end = new Date(options.checkOut);
        const days = (end - start) / (1000 * 60 * 60 * 24);
        total *= days;
    }
    
    return total;
}

// 动态更新价格显示
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        const priceElement = form.closest('.ticket-card, .hotel-card')?.querySelector('.price');
        
        if (!priceElement) return;
        
        const basePrice = parseFloat(priceElement.textContent.replace('¥', ''));
        
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                // 直接从表单元素获取值
                const roomType = form.querySelector('[name="room-type"]')?.value || 
                               form.querySelector('[name="hotel-room-type"]')?.value;
                               
                const checkIn = form.querySelector('[name="check-in-date"]')?.value || 
                              form.querySelector('[name="hotel-check-in"]')?.value;
                              
                const checkOut = form.querySelector('[name="check-out-date"]')?.value || 
                               form.querySelector('[name="hotel-check-out"]')?.value;
                
                const quantity = parseInt(
                    form.querySelector('[name="guest-count"]')?.value || 
                    form.querySelector('[name="ticket-quantity"]')?.value || 
                    form.querySelector('[name="spring-count"]')?.value || 
                    1
                );
                
                const options = {
                    roomType: roomType,
                    checkIn: checkIn,
                    checkOut: checkOut
                };
                
                const total = calculateTotal(basePrice, quantity, options);
                
                // 更新显示的价格
                priceElement.textContent = `¥${total.toFixed(0)}`;
            });
        });
    });
});

// 检查用户是否已登录
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('请先登录');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 加载预订记录
async function loadBookings(filter = 'all') {
    if (!checkAuth()) return;

    try {
        const response = await api.booking.getAllBookings();
        if (response.status === 'success') {
            const bookings = response.data.bookings;
            const filteredBookings = filter === 'all' 
                ? bookings 
                : bookings.filter(booking => booking.type === filter);
            
            displayBookings(filteredBookings);
        }
    } catch (error) {
        console.error('加载预订记录失败:', error);
    }
}

// 显示预订记录
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = '';

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p class="no-bookings">暂无预订记录</p>';
        return;
    }

    bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        
        const statusClass = {
            'confirmed': 'status-confirmed',
            'pending': 'status-pending',
            'cancelled': 'status-cancelled'
        }[booking.status] || 'status-pending';

        const statusText = {
            'confirmed': '已确认',
            'pending': '待确认',
            'cancelled': '已取消'
        }[booking.status] || '待确认';

        card.innerHTML = `
            <h3>${booking.type === 'ticket' ? '门票预订' : '酒店预订'}</h3>
            <p>${booking.type === 'ticket' ? booking.ticketName : booking.hotelName}</p>
            <p>预订时间：${new Date(booking.bookingDate).toLocaleString()}</p>
            ${booking.type === 'ticket' 
                ? `<p>游玩日期：${booking.visitDate}</p>
                   <p>数量：${booking.quantity}张</p>`
                : `<p>入住日期：${booking.checkInDate}</p>
                   <p>退房日期：${booking.checkOutDate}</p>
                   <p>房间数：${booking.roomCount}间</p>
                   <p>人数：${booking.guestCount}人</p>`
            }
            <p>总价：¥${booking.totalPrice}</p>
            <span class="booking-status ${statusClass}">${statusText}</span>
            ${booking.status === 'pending' ? `
                <div class="booking-actions">
                    <button class="btn-cancel" onclick="cancelBooking(${booking.id})">取消预订</button>
                </div>
            ` : ''}
        `;

        bookingsList.appendChild(card);
    });
}

// 取消预订
async function cancelBooking(id) {
    if (!confirm('确定要取消此预订吗？')) return;

    try {
        const response = await api.booking.updateBookingStatus(id, 'cancelled');
        if (response.status === 'success') {
            alert('预订已取消');
            loadBookings();
        } else {
            alert(response.message || '取消预订失败，请重试');
        }
    } catch (error) {
        console.error('取消预订失败:', error);
        alert('取消预订失败，请重试');
    }
}

// 预订记录筛选
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // 加载对应类型的预订记录
        loadBookings(button.getAttribute('data-filter'));
    });
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置日期输入的最小值为今天
    const today = new Date().toISOString().split('T')[0];
    const visitDate = document.getElementById('visit-date');
    const checkInDate = document.getElementById('check-in-date');
    const checkOutDate = document.getElementById('check-out-date');

    if (visitDate) visitDate.min = today;
    if (checkInDate) checkInDate.min = today;
    if (checkOutDate) checkOutDate.min = today;

    // 加载预订记录
    loadBookings();
}); 