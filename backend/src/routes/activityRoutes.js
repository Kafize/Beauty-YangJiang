const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// 验证规则
const activityValidation = [
    body('name').notEmpty().withMessage('活动名称不能为空'),
    body('description').notEmpty().withMessage('活动描述不能为空'),
    body('startDate').isISO8601().withMessage('开始日期格式不正确'),
    body('endDate').isISO8601().withMessage('结束日期格式不正确'),
    body('location').notEmpty().withMessage('活动地点不能为空'),
    body('price').isFloat({ min: 0 }).withMessage('价格必须大于0'),
    body('capacity').isInt({ min: 1 }).withMessage('容量必须大于0'),
    body('currentParticipants').isInt({ min: 0 }).withMessage('当前参与人数不能为负数'),
    body('status').isIn(['upcoming', 'ongoing', 'completed', 'cancelled']).withMessage('状态值不正确')
];

// 公开路由
router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivityById);

// 管理员路由
router.post('/', authMiddleware.isAdmin, activityValidation, activityController.createActivity);
router.put('/:id', authMiddleware.isAdmin, activityValidation, activityController.updateActivity);
router.delete('/:id', authMiddleware.isAdmin, activityController.deleteActivity);

// 更新参与人数路由
router.put('/:id/participants', authMiddleware.isAuthenticated, 
    body('currentParticipants').isInt({ min: 0 }).withMessage('参与人数不能为负数'),
    activityController.updateParticipants
);

module.exports = router; 