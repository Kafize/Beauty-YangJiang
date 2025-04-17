const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有景点
router.get('/', async (req, res) => {
    try {
        const [spots] = await db.query('SELECT * FROM scenic_spots ORDER BY rating DESC');
        res.json(spots);
    } catch (error) {
        console.error('获取景点列表失败:', error);
        res.status(500).json({ error: '获取景点列表失败' });
    }
});

// 获取单个景点
router.get('/:id', async (req, res) => {
    try {
        const [spots] = await db.query('SELECT * FROM scenic_spots WHERE id = ?', [req.params.id]);
        if (spots.length === 0) {
            return res.status(404).json({ error: '景点不存在' });
        }
        res.json(spots[0]);
    } catch (error) {
        console.error('获取景点详情失败:', error);
        res.status(500).json({ error: '获取景点详情失败' });
    }
});

// 创建景点
router.post('/', async (req, res) => {
    try {
        const { name, description, location, image_url, rating } = req.body;
        const [result] = await db.query(
            'INSERT INTO scenic_spots (name, description, location, image_url, rating) VALUES (?, ?, ?, ?, ?)',
            [name, description, location, image_url, rating]
        );
        res.status(201).json({ id: result.insertId, message: '景点创建成功' });
    } catch (error) {
        console.error('创建景点失败:', error);
        res.status(500).json({ error: '创建景点失败' });
    }
});

// 更新景点
router.put('/:id', async (req, res) => {
    try {
        const { name, description, location, image_url, rating } = req.body;
        const [result] = await db.query(
            'UPDATE scenic_spots SET name = ?, description = ?, location = ?, image_url = ?, rating = ? WHERE id = ?',
            [name, description, location, image_url, rating, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '景点不存在' });
        }
        res.json({ message: '景点更新成功' });
    } catch (error) {
        console.error('更新景点失败:', error);
        res.status(500).json({ error: '更新景点失败' });
    }
});

// 删除景点
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM scenic_spots WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '景点不存在' });
        }
        res.json({ message: '景点删除成功' });
    } catch (error) {
        console.error('删除景点失败:', error);
        res.status(500).json({ error: '删除景点失败' });
    }
});

module.exports = router; 