'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Activities', [
      {
        name: '龙舟赛',
        description: '传统水上竞技活动，体验阳江民俗文化。',
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-12'),
        location: '阳江市海陵岛',
        imageUrl: '/images/activities/dragon-boat.jpg',
        price: 50.00,
        capacity: 200,
        currentParticipants: 0,
        status: 'upcoming',
        features: JSON.stringify(['龙舟竞渡', '民俗表演', '美食节']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '渔家文化节',
        description: '体验渔家生活，感受海洋文化。',
        startDate: new Date('2024-07-15'),
        endDate: new Date('2024-07-17'),
        location: '阳江市沙扒湾',
        imageUrl: '/images/activities/fishing-village.jpg',
        price: 80.00,
        capacity: 150,
        currentParticipants: 0,
        status: 'upcoming',
        features: JSON.stringify(['渔家体验', '海鲜美食', '文化展示']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '风筝节',
        description: '传统风筝文化展示，感受民间艺术。',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-05-03'),
        location: '阳江市海陵岛',
        imageUrl: '/images/activities/kite-festival.jpg',
        price: 30.00,
        capacity: 300,
        currentParticipants: 0,
        status: 'upcoming',
        features: JSON.stringify(['风筝展示', 'DIY制作', '比赛活动']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Activities', null, {});
  }
}; 