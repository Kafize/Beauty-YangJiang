// 检查用户是否已登录
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 加载用户信息
async function loadUserProfile() {
    if (!checkAuth()) return;

    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('username').value = user.username || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('phone').value = user.phone || '';
        }
    } catch (error) {
        console.error('加载用户信息失败:', error);
    }
}

// 更新用户信息
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!checkAuth()) return;

    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {
        const response = await api.user.updateProfile(formData);
        if (response.status === 'success') {
            // 更新本地存储的用户信息
            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
            alert('个人信息更新成功！');
        } else {
            alert(response.message || '更新失败，请重试');
        }
    } catch (error) {
        console.error('更新用户信息失败:', error);
        alert('更新失败，请重试');
    }
});

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
                   <p>房间数：${booking.roomCount}间</p>`
            }
            <p>总价：¥${booking.totalPrice}</p>
            <span class="booking-status ${statusClass}">${statusText}</span>
        `;

        bookingsList.appendChild(card);
    });
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
    loadUserProfile();
    loadBookings();
}); 