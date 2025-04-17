// 模拟数据
window.mockData = {
    // 热门景点
    hotSpots: [
        {
            id: 1,
            name: '海陵岛',
            description: '海陵岛是阳江最著名的旅游胜地，拥有美丽的沙滩和清澈的海水。',
            image: 'images/scenic/hailing.jpg',
            rating: 4.8,
            category: 'nature'
        },
        {
            id: 2,
            name: '闸坡渔港',
            description: '闸坡渔港是阳江最大的渔港，可以体验渔民生活和品尝新鲜海鲜。',
            image: 'images/scenic/shapa.jpg',
            rating: 4.6,
            category: 'culture'
        },
        {
            id: 3,
            name: '阳江温泉',
            description: '阳江温泉是广东省著名的温泉度假胜地，水质优良，环境优美。',
            image: 'images/scenic/lingxiao.jpg',
            rating: 4.7,
            category: 'leisure'
        }
    ],

    // 所有景点
    allSpots: [
        {
            id: 1,
            name: '海陵岛',
            description: '海陵岛是阳江最著名的旅游胜地，拥有美丽的沙滩和清澈的海水。',
            image: 'images/scenic/hailing.jpg',
            rating: 4.8,
            category: 'nature',
            price: 120
        },
        {
            id: 2,
            name: '闸坡渔港',
            description: '闸坡渔港是阳江最大的渔港，可以体验渔民生活和品尝新鲜海鲜。',
            image: 'images/scenic/shapa.jpg',
            rating: 4.6,
            category: 'culture',
            price: 80
        },
        {
            id: 3,
            name: '阳江温泉',
            description: '阳江温泉是广东省著名的温泉度假胜地，水质优良，环境优美。',
            image: 'images/scenic/lingxiao.jpg',
            rating: 4.7,
            category: 'leisure',
            price: 150
        },
        {
            id: 4,
            name: '阳江博物馆',
            description: '展示阳江历史文化和民俗风情的重要场所。',
            image: 'images/scenic/museum.jpg',
            rating: 4.5,
            category: 'culture',
            price: 50
        },
        {
            id: 5,
            name: '灵光寺',
            description: '历史悠久的佛教寺庙，建筑风格独特。',
            image: 'images/scenic/temple.jpg',
            rating: 4.4,
            category: 'culture',
            price: 30
        },
        {
            id: 6,
            name: '海陵美食街',
            description: '汇集各类海鲜美食和本地特色小吃。',
            image: 'images/scenic/food.jpg',
            rating: 4.6,
            category: 'leisure',
            price: 100
        }
    ],

    // 最新活动
    latestActivities: [
        {
            id: 1,
            title: '海陵岛沙滩音乐节',
            description: '在海陵岛沙滩上举办的年度音乐盛会，邀请知名乐队和歌手表演。',
            image: 'images/scenic/hailing.jpg',
            date: '2024-05-01',
            location: '海陵岛沙滩'
        },
        {
            id: 2,
            title: '闸坡海鲜美食节',
            description: '品尝最新鲜的海鲜，体验阳江独特的海鲜美食文化。',
            image: 'images/scenic/food.jpg',
            date: '2024-06-15',
            location: '闸坡渔港'
        },
        {
            id: 3,
            title: '阳江温泉养生节',
            description: '体验温泉养生，学习健康生活方式，享受放松时光。',
            image: 'images/scenic/lingxiao.jpg',
            date: '2024-07-20',
            location: '阳江温泉度假村'
        }
    ],

    // 所有活动
    allActivities: [
        {
            id: 1,
            title: '海陵岛沙滩音乐节',
            description: '在海陵岛沙滩上举办的年度音乐盛会，邀请知名乐队和歌手表演。',
            image: 'images/scenic/hailing.jpg',
            start_date: '2024-05-01',
            end_date: '2024-05-03',
            location: '海陵岛沙滩',
            status: 'upcoming',
            category: 'music'
        },
        {
            id: 2,
            title: '闸坡海鲜美食节',
            description: '品尝最新鲜的海鲜，体验阳江独特的海鲜美食文化。',
            image: 'images/scenic/food.jpg',
            start_date: '2024-06-15',
            end_date: '2024-06-17',
            location: '闸坡渔港',
            status: 'upcoming',
            category: 'food'
        },
        {
            id: 3,
            title: '阳江温泉养生节',
            description: '体验温泉养生，学习健康生活方式，享受放松时光。',
            image: 'images/scenic/lingxiao.jpg',
            start_date: '2024-07-20',
            end_date: '2024-07-22',
            location: '阳江温泉度假村',
            status: 'upcoming',
            category: 'wellness'
        },
        {
            id: 4,
            title: '阳江风筝节',
            description: '一年一度的风筝盛会，展示各种精美的风筝和风筝制作技艺。',
            image: 'images/activities/kite-festival.jpg',
            start_date: '2024-04-01',
            end_date: '2024-04-03',
            location: '阳江风筝广场',
            status: 'ongoing',
            category: 'culture'
        },
        {
            id: 5,
            title: '阳江龙舟赛',
            description: '传统的龙舟比赛，展示阳江的民俗文化和团队精神。',
            image: 'images/activities/dragon-boat.jpg',
            start_date: '2024-06-10',
            end_date: '2024-06-12',
            location: '阳江河道',
            status: 'upcoming',
            category: 'sports'
        },
        {
            id: 6,
            title: '渔家文化节',
            description: '体验渔家生活，了解渔民文化，品尝海鲜美食。',
            image: 'images/activities/fishing-village.jpg',
            start_date: '2024-08-01',
            end_date: '2024-08-31',
            location: '阳江各地',
            status: 'upcoming',
            category: 'culture'
        }
    ],

    // 文化特色
    cultureFeatures: [
        {
            id: 1,
            type: 'fisherman',
            title: '渔家文化',
            description: '阳江作为沿海城市，拥有丰富的渔家文化。渔民们世代以海为生，形成了独特的渔家生活方式和习俗。',
            image: 'images/activities/fishing-village.jpg',
            features: [
                '传统渔船制作工艺',
                '渔家美食文化',
                '渔民节庆活动',
                '渔家民俗表演'
            ]
        },
        {
            id: 2,
            type: 'kite',
            title: '风筝文化',
            description: '阳江是中国著名的风筝之乡，拥有悠久的制作和放飞风筝的历史。阳江风筝以其精美的工艺和独特的造型闻名。',
            image: 'images/culture/kite.jpg',
            features: [
                '传统风筝制作技艺',
                '风筝节庆活动',
                '风筝博物馆',
                '风筝文化展示'
            ]
        },
        {
            id: 3,
            type: 'food',
            title: '美食文化',
            description: '阳江美食以海鲜为主，融合了粤菜和客家菜的特色，形成了独特的地方美食文化。',
            image: 'images/culture/food.jpg',
            features: [
                '海鲜美食',
                '传统小吃',
                '特色糕点',
                '地方特产'
            ]
        },
        {
            id: 4,
            type: 'folk',
            title: '民俗文化',
            description: '阳江拥有丰富的民俗文化，包括传统节日、民间艺术和习俗等，展现了阳江人民的生活智慧。',
            image: 'images/culture/folk.jpg',
            features: [
                '传统节日庆典',
                '民间艺术表演',
                '民俗手工艺',
                '传统习俗'
            ]
        }
    ],

    // 用户数据
    users: [
        {
            id: 1,
            username: 'test',
            email: 'test@example.com',
            password: 'password123'
        }
    ],

    // 模拟API
    api: {
        auth: {
            login: function({ email, password }) {
                const user = window.mockData.users.find(u => u.email === email && u.password === password);
                if (user) {
                    const token = 'mock_token_' + Date.now();
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify({
                        id: user.id,
                        name: user.username,
                        email: user.email
                    }));
                    return Promise.resolve({ token, user });
                }
                return Promise.reject(new Error('邮箱或密码错误'));
            },

            register: function({ username, email, password }) {
                if (window.mockData.users.find(u => u.email === email)) {
                    return Promise.reject(new Error('该邮箱已被注册'));
                }
                const newUser = {
                    id: window.mockData.users.length + 1,
                    username,
                    email,
                    password
                };
                window.mockData.users.push(newUser);
                return Promise.resolve({ message: '注册成功' });
            },

            logout: function() {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return Promise.resolve({ message: '退出成功' });
            },

            getCurrentUser: function() {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (token && user.id) {
                    return Promise.resolve(user);
                }
                return Promise.reject(new Error('未登录'));
            }
        }
    },

    // 推荐酒店
    featuredHotels: [
        {
            id: 1,
            name: '海陵岛度假酒店',
            description: '位于海陵岛海滨，拥有私人海滩和豪华海景房。',
            image: 'images/svg/hotel1.svg',
            rating: 4.8,
            price: 688,
            amenities: ['海景房', '私人海滩', '游泳池', 'SPA中心', '餐厅']
        },
        {
            id: 2,
            name: '闸坡渔港酒店',
            description: '靠近闸坡渔港，提供新鲜海鲜和渔家特色服务。',
            image: 'images/svg/hotel2.svg',
            rating: 4.6,
            price: 488,
            amenities: ['渔港景观', '海鲜餐厅', '会议室', '健身房']
        },
        {
            id: 3,
            name: '阳江温泉度假村',
            description: '五星级温泉度假村，提供高端温泉养生服务。',
            image: 'images/svg/hotel3.svg',
            rating: 4.9,
            price: 888,
            amenities: ['温泉套房', '养生SPA', '高尔夫球场', '会议中心', '中餐厅']
        }
    ]
}; 