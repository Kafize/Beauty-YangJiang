const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

// 获取评论
router.get('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const [comments] = await req.app.get('db').query(
      'SELECT c.*, u.username, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.comment_type = ? AND c.reference_id = ? AND c.status = "active" ORDER BY c.created_at DESC',
      [type, id]
    );
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({
      success: false,
      message: '获取评论失败'
    });
  }
});

// 创建评论
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, rating, comment_type, reference_id } = req.body;
    
    const [result] = await req.app.get('db').query(
      'INSERT INTO comments (user_id, content, rating, comment_type, reference_id) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, content, rating, comment_type, reference_id]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        content,
        rating,
        comment_type,
        reference_id
      }
    });
  } catch (error) {
    console.error('创建评论失败:', error);
    res.status(500).json({
      success: false,
      message: '创建评论失败'
    });
  }
});

module.exports = router; 