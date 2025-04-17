// 加载特色景点
function loadFeaturedSpots() {
    const spotsGrid = document.querySelector('.spots-grid');
    if (!spotsGrid) return;

    spotsGrid.innerHTML = '';
    mockData.hotSpots.forEach(spot => {
        const spotCard = document.createElement('div');
        spotCard.className = 'spot-card';
        spotCard.innerHTML = `
            <div class="spot-image">
                <img src="${spot.image}" alt="${spot.name}">
            </div>
            <div class="spot-info">
                <h3>${spot.name}</h3>
                <p>${spot.description}</p>
                <div class="spot-rating">
                    <span class="stars">${'★'.repeat(Math.floor(spot.rating))}${'☆'.repeat(5-Math.floor(spot.rating))}</span>
                    <span class="rating">${spot.rating}</span>
                </div>
                <a href="scenic.html?id=${spot.id}" class="btn btn-outline">查看详情</a>
            </div>
        `;
        spotsGrid.appendChild(spotCard);
    });
}

// 加载热门活动
function loadFeaturedActivities() {
    const activitiesGrid = document.querySelector('.activities-grid');
    if (!activitiesGrid) return;

    activitiesGrid.innerHTML = '';
    mockData.latestActivities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-card';
        activityCard.innerHTML = `
            <div class="activity-image">
                <img src="${activity.image}" alt="${activity.title}">
            </div>
            <div class="activity-info">
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
                <div class="activity-meta">
                    <span class="date">${activity.date}</span>
                    <span class="location">${activity.location}</span>
                </div>
                <a href="activities.html?id=${activity.id}" class="btn btn-outline">了解更多</a>
            </div>
        `;
        activitiesGrid.appendChild(activityCard);
    });
}

// 加载推荐酒店
function loadFeaturedHotels() {
    const hotelsGrid = document.querySelector('.hotels-grid');
    if (!hotelsGrid) return;

    hotelsGrid.innerHTML = '';
    mockData.featuredHotels.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card';
        hotelCard.innerHTML = `
            <div class="hotel-image">
                <img src="${hotel.image}" alt="${hotel.name}">
            </div>
            <div class="hotel-info">
                <h3>${hotel.name}</h3>
                <p>${hotel.description}</p>
                <div class="hotel-rating">
                    <span class="stars">${'★'.repeat(Math.floor(hotel.rating))}${'☆'.repeat(5-Math.floor(hotel.rating))}</span>
                    <span class="rating">${hotel.rating}</span>
                </div>
                <div class="hotel-amenities">
                    ${hotel.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                </div>
                <div class="hotel-price">
                    <span class="price">¥${hotel.price}</span>
                    <span class="unit">/晚</span>
                </div>
                <a href="booking.html?type=hotel&id=${hotel.id}" class="btn btn-primary">立即预订</a>
            </div>
        `;
        hotelsGrid.appendChild(hotelCard);
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedSpots();
    loadFeaturedActivities();
    loadFeaturedHotels();
}); 