'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Scenics', [
      {
        name: '海陵岛',
        description: '中国十大最美海岛之一，拥有绵延的沙滩和清澈的海水。',
        location: '阳江市海陵岛',
        imageUrl: '/images/scenic/hailing.jpg',
        price: 100.00,
        openingHours: '全天开放',
        features: JSON.stringify(['沙滩', '海水浴场', '海鲜美食']),
        rating: 4.8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '凌霄岩',
        description: '天然溶洞奇观，感受大自然的鬼斧神工。',
        location: '阳江市阳东区',
        imageUrl: '/images/scenic/lingxiao.jpg',
        price: 80.00,
        openingHours: '08:00-17:00',
        features: JSON.stringify(['溶洞', '钟乳石', '地下河']),
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '沙扒湾',
        description: '碧海银滩，休闲度假胜地。',
        location: '阳江市阳西县',
        imageUrl: '/images/scenic/shapa.jpg',
        price: 60.00,
        openingHours: '全天开放',
        features: JSON.stringify(['沙滩', '渔村', '海鲜']),
        rating: 4.6,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Scenics', null, {});
  }
}; 