const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// 门票预订验证规则
const ticketBookingValidation = [
    body('type').equals('ticket').withMessage('预订类型必须是门票'),
    body('ticketName').notEmpty().withMessage('门票名称不能为空'),
    body('visitDate').isDate().withMessage('游玩日期格式不正确'),
    body('quantity').isInt({ min: 1 }).withMessage('门票数量必须大于0'),
    body('totalPrice').isFloat({ min: 0 }).withMessage('总价必须大于0')
];

// 酒店预订验证规则
const hotelBookingValidation = [
    body('type').equals('hotel').withMessage('预订类型必须是酒店'),
    body('hotelName').notEmpty().withMessage('酒店名称不能为空'),
    body('checkInDate').isDate().withMessage('入住日期格式不正确'),
    body('checkOutDate').isDate().withMessage('退房日期格式不正确'),
    body('roomCount').isInt({ min: 1 }).withMessage('房间数必须大于0'),
    body('guestCount').isInt({ min: 1 }).withMessage('人数必须大于0'),
    body('totalPrice').isFloat({ min: 0 }).withMessage('总价必须大于0')
];

// 预订状态更新验证规则
const updateStatusValidation = [
    body('status').isIn(['pending', 'confirmed', 'cancelled'])
        .withMessage('无效的预订状态')
];

// 创建预订
router.post('/', authMiddleware, (req, res, next) => {
    const { type } = req.body;
    if (type === 'ticket') {
        return ticketBookingValidation(req, res, next);
    } else if (type === 'hotel') {
        return hotelBookingValidation(req, res, next);
    } else {
        return res.status(400).json({
            status: 'error',
            message: '无效的预订类型'
        });
    }
}, bookingController.createBooking);

// 获取所有预订
router.get('/', authMiddleware, bookingController.getAllBookings);

// 获取单个预订详情
router.get('/:id', authMiddleware, bookingController.getBookingById);

// 更新预订状态
router.put('/:id/status', authMiddleware, updateStatusValidation, bookingController.updateBookingStatus);

module.exports = router; 