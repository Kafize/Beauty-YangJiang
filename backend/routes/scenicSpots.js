const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// 获取所有景点
router.get('/', async (req, res) => {
  try {
    const [spots] = await req.app.get('db').query('SELECT * FROM scenic_spots WHERE status = "active"');
    res.json({
      success: true,
      data: spots
    });
  } catch (error) {
    console.error('获取景点列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取景点列表失败'
    });
  }
});

// 获取单个景点详情
router.get('/:id', async (req, res) => {
  try {
    const [spots] = await req.app.get('db').query(
      'SELECT * FROM scenic_spots WHERE id = ? AND status = "active"',
      [req.params.id]
    );
    
    if (spots.length === 0) {
      return res.status(404).json({
        success: false,
        message: '景点不存在'
      });
    }
    
    res.json({
      success: true,
      data: spots[0]
    });
  } catch (error) {
    console.error('获取景点详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取景点详情失败'
    });
  }
});

module.exports = router; 