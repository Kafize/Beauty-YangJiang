const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// 创建预订
exports.createBooking = async (req, res) => {
    try {
        // 验证请求数据
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: '验证失败',
                errors: errors.array()
            });
        }

        const bookingData = {
            ...req.body,
            userId: req.user.id
        };

        // 创建预订
        const booking = await Booking.create(bookingData);

        res.status(201).json({
            status: 'success',
            message: '预订创建成功',
            data: { booking }
        });
    } catch (error) {
        console.error('创建预订失败:', error);
        res.status(500).json({
            status: 'error',
            message: '创建预订失败，请稍后重试'
        });
    }
};

// 获取用户的所有预订
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            order: [['bookingDate', 'DESC']]
        });

        res.json({
            status: 'success',
            data: { bookings }
        });
    } catch (error) {
        console.error('获取预订记录失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取预订记录失败'
        });
    }
};

// 获取单个预订详情
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: '预订不存在'
            });
        }

        res.json({
            status: 'success',
            data: { booking }
        });
    } catch (error) {
        console.error('获取预订详情失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取预订详情失败'
        });
    }
};

// 更新预订状态
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!booking) {
            return res.status(404).json({
                status: 'error',
                message: '预订不存在'
            });
        }

        // 更新状态
        await booking.update({ status });

        res.json({
            status: 'success',
            message: '预订状态更新成功',
            data: { booking }
        });
    } catch (error) {
        console.error('更新预订状态失败:', error);
        res.status(500).json({
            status: 'error',
            message: '更新预订状态失败'
        });
    }
}; 