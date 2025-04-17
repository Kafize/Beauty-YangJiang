// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动端菜单处理
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // 移动菜单按钮点击事件
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 图片懒加载
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }

    // 景点卡片悬停效果
    const spotCards = document.querySelectorAll('.spot-card');
    spotCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // 滚动效果
    const scrollElements = document.querySelectorAll('.scroll-reveal');

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('active');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('active');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    // 初始化滚动效果
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // 页面加载时检查可见元素
    handleScrollAnimation();

    // 响应式图片处理
    function handleResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (window.innerWidth <= 768) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
        handleResponsiveImages();
        handleScrollAnimation();
    });

    // 初始化响应式图片
    handleResponsiveImages();
});

// 添加页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    loadHotSpots();
    loadLatestActivities();
});

// 导航栏处理
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const loginBtn = navbar.querySelector('.login-btn');
        const registerBtn = navbar.querySelector('.register-btn');
        const userMenu = navbar.querySelector('.user-menu');
        const logoutBtn = navbar.querySelector('.logout-btn');

        // 检查登录状态
        function checkLoginStatus() {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return { token, user };
        }

        // 更新UI
        function updateNavUI() {
            const { token, user } = checkLoginStatus();
            if (token && user.name) {
                if (loginBtn) loginBtn.style.display = 'none';
                if (registerBtn) registerBtn.style.display = 'none';
                if (userMenu) {
                    userMenu.style.display = 'block';
                    userMenu.innerHTML = `
                        <span class="username">${user.name}</span>
                        <button class="btn btn-outline logout-btn">退出</button>
                    `;
                }
            } else {
                if (loginBtn) loginBtn.style.display = 'block';
                if (registerBtn) registerBtn.style.display = 'block';
                if (userMenu) userMenu.style.display = 'none';
            }
        }

        // 登出功能
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            });
        }

        // 初始化时更新UI
        updateNavUI();
    }
});

// 加载热门景点
function loadHotSpots() {
    const spotsContainer = document.querySelector('.spots-grid');
    if (!spotsContainer) return;

    try {
        // 使用模拟数据
        const spots = window.mockData.hotSpots;
        
        spotsContainer.innerHTML = '';
        spots.forEach(spot => {
            const card = createSpotCard(spot);
            spotsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('加载热门景点失败:', error);
        spotsContainer.innerHTML = '<p class="error">加载失败，请稍后重试</p>';
    }
}

// 加载最新活动
function loadLatestActivities() {
    const activitiesContainer = document.querySelector('.activities-grid');
    if (!activitiesContainer) return;

    try {
        // 使用模拟数据
        const activities = window.mockData.latestActivities;
        
        activitiesContainer.innerHTML = '';
        activities.forEach(activity => {
            const card = createActivityCard(activity);
            activitiesContainer.appendChild(card);
        });
    } catch (error) {
        console.error('加载最新活动失败:', error);
        activitiesContainer.innerHTML = '<p class="error">加载失败，请稍后重试</p>';
    }
}

// 创建景点卡片
function createSpotCard(spot) {
    const card = document.createElement('div');
    card.className = 'spot-card';
    card.innerHTML = `
        <img src="${spot.image}" alt="${spot.name}" class="spot-image">
        <div class="spot-info">
            <h3>${spot.name}</h3>
            <p>${spot.description}</p>
            <div class="spot-meta">
                <span class="rating">评分：${spot.rating}</span>
                ${spot.price ? `<span class="price">¥${spot.price}</span>` : ''}
            </div>
            <a href="scenic-detail.html?id=${spot.id}" class="btn-details">了解更多</a>
        </div>
    `;
    return card;
}

// 创建活动卡片
function createActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
        <img src="${activity.image}" alt="${activity.title}" class="activity-image">
        <div class="activity-info">
            <h3>${activity.title}</h3>
            <p>${activity.description}</p>
            <div class="activity-meta">
                <span class="date">${activity.date}</span>
                <span class="location">${activity.location}</span>
            </div>
            <a href="activity-detail.html?id=${activity.id}" class="btn-details">了解更多</a>
        </div>
    `;
    return card;
}