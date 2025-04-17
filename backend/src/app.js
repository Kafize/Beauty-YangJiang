const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('../config/database');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const scenicRoutes = require('./routes/scenicRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API 路由
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/scenic', scenicRoutes);
app.use('/api/activities', activityRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: '服务器内部错误！'
    });
});

// 数据库连接和服务器启动
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 测试数据库连接
        await sequelize.authenticate();
        console.log('数据库连接成功');

        // 同步数据库模型
        await sequelize.sync({ alter: true });
        console.log('数据库模型同步完成');

        // 启动服务器
        app.listen(PORT, () => {
            console.log(`服务器运行在端口 ${PORT}`);
        });
    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app; 