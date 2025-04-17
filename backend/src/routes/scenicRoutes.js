const express = require('express');
const router = express.Router();
const scenicController = require('../controllers/scenicController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// 验证规则
const scenicValidation = [
    body('name').notEmpty().withMessage('景点名称不能为空'),
    body('description').notEmpty().withMessage('景点描述不能为空'),
    body('location').notEmpty().withMessage('景点位置不能为空'),
    body('price').isFloat({ min: 0 }).withMessage('价格必须大于0'),
    body('openingHours').notEmpty().withMessage('开放时间不能为空'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('评分必须在0-5之间')
];

// 公开路由
router.get('/', scenicController.getAllSpots);
router.get('/:id', scenicController.getSpotById);

// 管理员路由
router.post('/', authMiddleware.isAdmin, scenicValidation, scenicController.createSpot);
router.put('/:id', authMiddleware.isAdmin, scenicValidation, scenicController.updateSpot);
router.delete('/:id', authMiddleware.isAdmin, scenicController.deleteSpot);

module.exports = router; 