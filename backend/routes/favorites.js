const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// 获取用户的所有收藏
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [favorites] = await req.app.get('db').query(
      'SELECT * FROM favorites WHERE user_id = ?',
      [req.user.id]
    );
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取收藏列表失败'
    });
  }
});

// 添加收藏
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { favorite_type, reference_id } = req.body;
    
    const [result] = await req.app.get('db').query(
      'INSERT INTO favorites (user_id, favorite_type, reference_id) VALUES (?, ?, ?)',
      [req.user.id, favorite_type, reference_id]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        favorite_type,
        reference_id
      }
    });
  } catch (error) {
    console.error('添加收藏失败:', error);
    res.status(500).json({
      success: false,
      message: '添加收藏失败'
    });
  }
});

// 取消收藏
router.delete('/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    await req.app.get('db').query(
      'DELETE FROM favorites WHERE user_id = ? AND favorite_type = ? AND reference_id = ?',
      [req.user.id, type, id]
    );
    
    res.json({
      success: true,
      message: '收藏已取消'
    });
  } catch (error) {
    console.error('取消收藏失败:', error);
    res.status(500).json({
      success: false,
      message: '取消收藏失败'
    });
  }
});

module.exports = router; 