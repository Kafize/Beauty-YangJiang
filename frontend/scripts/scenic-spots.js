// 默认图片SVG
const defaultImageSvg = `
<svg width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f5f5"/>
    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">暂无图片</text>
</svg>`;

// 加载景点列表
async function loadScenicSpots() {
    const container = document.querySelector('.scenic-spots-container');
    if (!container) {
        console.error('找不到景点容器元素');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/scenic-spots');
        if (!response.ok) {
            throw new Error('获取景点列表失败');
        }
        
        const spots = await response.json();
        
        if (spots.length === 0) {
            container.innerHTML = '<div class="no-spots">暂无景点数据</div>';
            return;
        }
        
        container.innerHTML = spots.map(spot => `
            <div class="scenic-spot-card">
                <div class="scenic-spot-image">
                    ${spot.image_url ? `<img src="${spot.image_url}" alt="${spot.name}">` : defaultImageSvg}
                </div>
                <div class="scenic-spot-info">
                    <h2>${spot.name}</h2>
                    <p>${spot.description || '暂无描述'}</p>
                    <div class="scenic-spot-location">${spot.location || '未知地点'}</div>
                    <div class="scenic-spot-rating">评分：${spot.rating || '暂无评分'}</div>
                    <div class="scenic-spot-visits">访问次数：${spot.visit_count || 0}</div>
                    <div class="scenic-spot-actions">
                        <button onclick="viewSpotDetail(${spot.id})">查看详情</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('加载景点列表错误:', error);
        container.innerHTML = '<div class="error">加载景点列表失败，请稍后重试</div>';
    }
}

// 查看景点详情
function viewSpotDetail(id) {
    window.location.href = `scenic-spot-detail.html?id=${id}`;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadScenicSpots();
}); 