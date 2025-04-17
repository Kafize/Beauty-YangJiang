const Activity = require('../models/Activity');
const { Op } = require('sequelize');

// 获取所有活动
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll({
            order: [['startDate', 'ASC']]
        });

        res.json({
            status: 'success',
            data: { activities }
        });
    } catch (error) {
        console.error('获取活动列表失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取活动列表失败'
        });
    }
};

// 获取单个活动详情
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);

        if (!activity) {
            return res.status(404).json({
                status: 'error',
                message: '活动不存在'
            });
        }

        res.json({
            status: 'success',
            data: { activity }
        });
    } catch (error) {
        console.error('获取活动详情失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取活动详情失败'
        });
    }
};

// 创建新活动（管理员功能）
exports.createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);

        res.status(201).json({
            status: 'success',
            message: '活动创建成功',
            data: { activity }
        });
    } catch (error) {
        console.error('创建活动失败:', error);
        res.status(500).json({
            status: 'error',
            message: '创建活动失败'
        });
    }
};

// 更新活动信息（管理员功能）
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);

        if (!activity) {
            return res.status(404).json({
                status: 'error',
                message: '活动不存在'
            });
        }

        await activity.update(req.body);

        res.json({
            status: 'success',
            message: '活动信息更新成功',
            data: { activity }
        });
    } catch (error) {
        console.error('更新活动信息失败:', error);
        res.status(500).json({
            status: 'error',
            message: '更新活动信息失败'
        });
    }
};

// 删除活动（管理员功能）
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);

        if (!activity) {
            return res.status(404).json({
                status: 'error',
                message: '活动不存在'
            });
        }

        await activity.destroy();

        res.json({
            status: 'success',
            message: '活动删除成功'
        });
    } catch (error) {
        console.error('删除活动失败:', error);
        res.status(500).json({
            status: 'error',
            message: '删除活动失败'
        });
    }
};

// 更新活动参与人数
exports.updateParticipants = async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);

        if (!activity) {
            return res.status(404).json({
                status: 'error',
                message: '活动不存在'
            });
        }

        const { currentParticipants } = req.body;

        if (currentParticipants > activity.capacity) {
            return res.status(400).json({
                status: 'error',
                message: '参与人数超过活动容量'
            });
        }

        await activity.update({ currentParticipants });

        res.json({
            status: 'success',
            message: '活动参与人数更新成功',
            data: { activity }
        });
    } catch (error) {
        console.error('更新活动参与人数失败:', error);
        res.status(500).json({
            status: 'error',
            message: '更新活动参与人数失败'
        });
    }
}; 