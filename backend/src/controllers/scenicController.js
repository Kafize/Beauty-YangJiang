const Scenic = require('../models/Scenic');
const { Op } = require('sequelize');

// 获取所有景点
exports.getAllSpots = async (req, res) => {
    try {
        const spots = await Scenic.findAll({
            order: [['rating', 'DESC']]
        });

        res.json({
            status: 'success',
            data: { spots }
        });
    } catch (error) {
        console.error('获取景点列表失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取景点列表失败'
        });
    }
};

// 获取单个景点详情
exports.getSpotById = async (req, res) => {
    try {
        const spot = await Scenic.findByPk(req.params.id);

        if (!spot) {
            return res.status(404).json({
                status: 'error',
                message: '景点不存在'
            });
        }

        res.json({
            status: 'success',
            data: { spot }
        });
    } catch (error) {
        console.error('获取景点详情失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取景点详情失败'
        });
    }
};

// 创建新景点（管理员功能）
exports.createSpot = async (req, res) => {
    try {
        const spot = await Scenic.create(req.body);

        res.status(201).json({
            status: 'success',
            message: '景点创建成功',
            data: { spot }
        });
    } catch (error) {
        console.error('创建景点失败:', error);
        res.status(500).json({
            status: 'error',
            message: '创建景点失败'
        });
    }
};

// 更新景点信息（管理员功能）
exports.updateSpot = async (req, res) => {
    try {
        const spot = await Scenic.findByPk(req.params.id);

        if (!spot) {
            return res.status(404).json({
                status: 'error',
                message: '景点不存在'
            });
        }

        await spot.update(req.body);

        res.json({
            status: 'success',
            message: '景点信息更新成功',
            data: { spot }
        });
    } catch (error) {
        console.error('更新景点信息失败:', error);
        res.status(500).json({
            status: 'error',
            message: '更新景点信息失败'
        });
    }
};

// 删除景点（管理员功能）
exports.deleteSpot = async (req, res) => {
    try {
        const spot = await Scenic.findByPk(req.params.id);

        if (!spot) {
            return res.status(404).json({
                status: 'error',
                message: '景点不存在'
            });
        }

        await spot.destroy();

        res.json({
            status: 'success',
            message: '景点删除成功'
        });
    } catch (error) {
        console.error('删除景点失败:', error);
        res.status(500).json({
            status: 'error',
            message: '删除景点失败'
        });
    }
}; 