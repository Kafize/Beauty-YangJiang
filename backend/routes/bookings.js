const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// 获取用户的所有预订
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [bookings] = await req.app.get('db').query(
      'SELECT * FROM bookings WHERE user_id = ?',
      [req.user.id]
    );
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('获取预订列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取预订列表失败'
    });
  }
});

// 创建新预订
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { booking_type, reference_id, booking_date, quantity, total_price } = req.body;
    
    const [result] = await req.app.get('db').query(
      'INSERT INTO bookings (user_id, booking_type, reference_id, booking_date, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, booking_type, reference_id, booking_date, quantity, total_price]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        booking_type,
        reference_id,
        booking_date,
        quantity,
        total_price
      }
    });
  } catch (error) {
    console.error('创建预订失败:', error);
    res.status(500).json({
      success: false,
      message: '创建预订失败'
    });
  }
});

module.exports = router; 