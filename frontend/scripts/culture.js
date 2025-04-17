// 加载文化特色
document.addEventListener('DOMContentLoaded', () => {
    loadCultureFeatures();
    setupAnimations();
});

// 加载文化特色
function loadCultureFeatures() {
    const cultureGrid = document.querySelector('.culture-grid');
    if (!cultureGrid) return;

    try {
        // 使用模拟数据
        const features = window.mockData.cultureFeatures;
        
        cultureGrid.innerHTML = '';
        features.forEach(feature => {
            const card = createCultureCard(feature);
            cultureGrid.appendChild(card);
        });
    } catch (error) {
        console.error('加载文化特色失败:', error);
        cultureGrid.innerHTML = '<p class="error">加载文化特色失败，请稍后重试</p>';
    }
}

function createCultureCard(feature) {
    const card = document.createElement('article');
    card.className = 'culture-card';
    card.innerHTML = `
        <div class="culture-image">
            <img src="${feature.image}" alt="${feature.title}">
        </div>
        <div class="culture-content">
            <h2>${feature.title}</h2>
            <p>${feature.description}</p>
            <ul class="feature-list">
                ${feature.features.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <button class="btn-details" onclick="viewCultureDetail('${feature.type}')">了解更多</button>
        </div>
    `;
    return card;
}

// 查看文化详情
function viewCultureDetail(type) {
    // 根据不同类型跳转到相应的详情页面
    window.location.href = `culture-detail.html?type=${type}`;
}

// 设置动画效果
function setupAnimations() {
    const cards = document.querySelectorAll('.culture-card');
    
    // 为每个卡片添加延迟动画
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
} 