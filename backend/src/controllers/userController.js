const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// 用户注册
exports.register = async (req, res) => {
    try {
        // 验证请求数据
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: '验证失败',
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;

        // 检查邮箱是否已存在
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: '该邮箱已被注册'
            });
        }

        // 创建新用户
        const user = await User.create({
            username,
            email,
            password
        });

        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            status: 'success',
            message: '注册成功',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({
            status: 'error',
            message: '注册失败，请稍后重试'
        });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 查找用户
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: '邮箱或密码错误'
            });
        }

        // 验证密码
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: 'error',
                message: '邮箱或密码错误'
            });
        }

        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            status: 'success',
            message: '登录成功',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('登录失败:', error);
        res.status(500).json({
            status: 'error',
            message: '登录失败，请稍后重试'
        });
    }
};

// 获取用户信息
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'phone']
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: '用户不存在'
            });
        }

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({
            status: 'error',
            message: '获取用户信息失败'
        });
    }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: '用户不存在'
            });
        }

        // 更新用户信息
        await user.update({
            username: username || user.username,
            email: email || user.email,
            phone: phone || user.phone
        });

        res.json({
            status: 'success',
            message: '个人信息更新成功',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone
                }
            }
        });
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({
            status: 'error',
            message: '更新用户信息失败'
        });
    }
}; 