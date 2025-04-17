const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有文章
router.get('/', async (req, res) => {
    try {
        const [articles] = await db.query(`
            SELECT a.*, u.username as author_name 
            FROM articles a 
            LEFT JOIN users u ON a.author_id = u.id 
            ORDER BY a.created_at DESC
        `);
        res.json(articles);
    } catch (error) {
        console.error('获取文章列表失败:', error);
        res.status(500).json({ error: '获取文章列表失败' });
    }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
    try {
        const [articles] = await db.query(`
            SELECT a.*, u.username as author_name 
            FROM articles a 
            LEFT JOIN users u ON a.author_id = u.id 
            WHERE a.id = ?
        `, [req.params.id]);
        
        if (articles.length === 0) {
            return res.status(404).json({ error: '文章不存在' });
        }
        res.json(articles[0]);
    } catch (error) {
        console.error('获取文章详情失败:', error);
        res.status(500).json({ error: '获取文章详情失败' });
    }
});

// 创建文章
router.post('/', async (req, res) => {
    try {
        const { title, content, author_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)',
            [title, content, author_id]
        );
        res.status(201).json({ id: result.insertId, message: '文章创建成功' });
    } catch (error) {
        console.error('创建文章失败:', error);
        res.status(500).json({ error: '创建文章失败' });
    }
});

// 更新文章
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const [result] = await db.query(
            'UPDATE articles SET title = ?, content = ? WHERE id = ?',
            [title, content, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '文章不存在' });
        }
        res.json({ message: '文章更新成功' });
    } catch (error) {
        console.error('更新文章失败:', error);
        res.status(500).json({ error: '更新文章失败' });
    }
});

// 删除文章
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '文章不存在' });
        }
        res.json({ message: '文章删除成功' });
    } catch (error) {
        console.error('删除文章失败:', error);
        res.status(500).json({ error: '删除文章失败' });
    }
});

module.exports = router; 