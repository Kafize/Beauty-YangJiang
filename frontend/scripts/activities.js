let currentActivities = [];

// 活动相关的API函数
const api = {
    baseUrl: 'http://localhost:3000/api',
    async getActivities() {
        const response = await fetch(`${this.baseUrl}/activities`);
        if (!response.ok) {
            throw new Error('获取活动列表失败');
        }
        return response.json();
    }
};

// 默认图片SVG
const defaultImageSvg = `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%23666" text-anchor="middle" dy=".3em">活动图片</text></svg>`;

// 加载活动列表
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    setupFilters();
});

// 加载活动列表
function loadActivities(filters = {}) {
    const activitiesContainer = document.querySelector('.activities-container');
    if (!activitiesContainer) return;

    try {
        // 使用模拟数据
        let activities = [...window.mockData.allActivities];

        // 应用筛选
        if (filters.status && filters.status !== 'all') {
            activities = activities.filter(activity => activity.status === filters.status);
        }

        if (activities.length === 0) {
            activitiesContainer.innerHTML = '<p class="no-activities">暂无活动</p>';
            return;
        }

        activitiesContainer.innerHTML = '';
        activities.forEach(activity => {
            const activityCard = createActivityCard(activity);
            activitiesContainer.appendChild(activityCard);
        });
    } catch (error) {
        console.error('加载活动失败:', error);
        activitiesContainer.innerHTML = '<p class="error">加载活动失败，请稍后重试</p>';
    }
}

function createActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
        <div class="activity-image">
            <img src="${activity.image}" alt="${activity.title}">
        </div>
        <div class="activity-info">
            <h3>${activity.title}</h3>
            <p class="activity-date">${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}</p>
            <p class="activity-location">${activity.location || '地点待定'}</p>
            <p class="activity-description">${activity.description || '暂无描述'}</p>
            <a href="activity-detail.html?id=${activity.id}" class="btn-details">了解更多</a>
        </div>
    `;
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');
            
            // 获取筛选条件
            const status = button.dataset.status;
            loadActivities({ status });
        });
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'upcoming': '即将开始',
        'ongoing': '进行中',
        'completed': '已结束',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 过滤活动
function filterActivities(status) {
    if (status === 'all') {
        displayActivities(currentActivities);
    } else {
        const filteredActivities = currentActivities.filter(activity => activity.status === status);
        displayActivities(filteredActivities);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();

    // 添加筛选按钮事件监听
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // 过滤活动
            filterActivities(button.dataset.status);
        });
    });
}); 