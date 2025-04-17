// 加载景点列表
document.addEventListener('DOMContentLoaded', () => {
    loadScenicSpots();
    setupFilters();
});

function loadScenicSpots(filters = {}) {
    const spotsContainer = document.querySelector('.scenic-grid');
    if (!spotsContainer) return;

    try {
        // 使用模拟数据
        let spots = [...window.mockData.allSpots];

        // 应用筛选
        if (filters.category && filters.category !== 'all') {
            spots = spots.filter(spot => spot.category === filters.category);
        }

        if (spots.length === 0) {
            spotsContainer.innerHTML = '<p class="no-scenic">暂无符合条件的景点</p>';
            return;
        }

        spotsContainer.innerHTML = '';
        spots.forEach(spot => {
            const spotCard = createSpotCard(spot);
            spotsContainer.appendChild(spotCard);
        });
    } catch (error) {
        console.error('加载景点失败:', error);
        spotsContainer.innerHTML = '<p class="error-message">加载景点失败，请稍后重试</p>';
    }
}

function createSpotCard(spot) {
    const card = document.createElement('div');
    card.className = 'scenic-card';
    card.innerHTML = `
        <div class="scenic-image">
            <img src="${spot.image}" alt="${spot.name}">
        </div>
        <div class="scenic-info">
            <h3>${spot.name}</h3>
            <div class="scenic-location">
                <i class="fas fa-map-marker-alt"></i>
                ${spot.location || '阳江市'}
            </div>
            <p class="scenic-description">${spot.description}</p>
            <div class="scenic-meta">
                <span class="scenic-price">¥${spot.price}</span>
                <span class="scenic-rating">
                    <i class="fas fa-star"></i>
                    ${spot.rating}
                </span>
            </div>
            <a href="scenic-detail.html?id=${spot.id}" class="view-details">查看详情</a>
        </div>
    `;
    return card;
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
            const category = button.dataset.category;
            loadScenicSpots({ category });
        });
    });
} 