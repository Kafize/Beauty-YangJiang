const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// 获取所有景点
router.get('/', async (req, res) => {
    try {
        // TODO: 从数据库获取景点数据
        res.json({
            status: 'success',
            data: {
                spots: []
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 获取单个景点详情
router.get('/:id', async (req, res) => {
    try {
        // TODO: 从数据库获取单个景点数据
        res.json({
            status: 'success',
            data: {
                spot: {}
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router; 