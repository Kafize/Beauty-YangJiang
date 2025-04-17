const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// 获取所有酒店
router.get('/', async (req, res) => {
  try {
    const [hotels] = await req.app.get('db').query('SELECT * FROM hotels WHERE status = "active"');
    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('获取酒店列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取酒店列表失败'
    });
  }
});

// 获取单个酒店详情
router.get('/:id', async (req, res) => {
  try {
    const [hotels] = await req.app.get('db').query(
      'SELECT * FROM hotels WHERE id = ? AND status = "active"',
      [req.params.id]
    );
    
    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在'
      });
    }
    
    res.json({
      success: true,
      data: hotels[0]
    });
  } catch (error) {
    console.error('获取酒店详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取酒店详情失败'
    });
  }
});

module.exports = router; 