const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// 获取所有活动
router.get('/', async (req, res) => {
  try {
    const [activities] = await req.app.get('db').query('SELECT * FROM activities WHERE status != "cancelled"');
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('获取活动列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动列表失败'
    });
  }
});

// 获取单个活动详情
router.get('/:id', async (req, res) => {
  try {
    const [activities] = await req.app.get('db').query(
      'SELECT * FROM activities WHERE id = ? AND status != "cancelled"',
      [req.params.id]
    );
    
    if (activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: '活动不存在'
      });
    }
    
    res.json({
      success: true,
      data: activities[0]
    });
  } catch (error) {
    console.error('获取活动详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取活动详情失败'
    });
  }
});

module.exports = router; 