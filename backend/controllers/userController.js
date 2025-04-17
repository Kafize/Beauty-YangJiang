const User = require('../models/user');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

// 生成JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// 用户注册
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
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

        // 生成token
        const token = signToken(user.id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 检查用户是否存在
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({
                status: 'error',
                message: '邮箱或密码错误'
            });
        }

        // 生成token
        const token = signToken(user.id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 获取用户信息
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 更新用户信息
exports.updateProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findByPk(req.user.id);
        
        user.username = username;
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 更新头像
exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: '请上传头像文件'
            });
        }

        const user = await User.findByPk(req.user.id);

        // 删除旧头像
        if (user.avatar) {
            const oldAvatarPath = path.join(__dirname, '..', process.env.UPLOAD_PATH, user.avatar);
            try {
                await fs.unlink(oldAvatarPath);
            } catch (error) {
                console.log('删除旧头像失败:', error);
            }
        }

        // 更新头像路径
        user.avatar = req.file.filename;
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 更新密码
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        // 验证当前密码
        if (!(await user.validatePassword(currentPassword))) {
            return res.status(401).json({
                status: 'error',
                message: '当前密码错误'
            });
        }

        // 更新密码
        user.password = newPassword;
        await user.save();

        // 生成新token
        const token = signToken(user.id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 获取所有用户（管理员功能）
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'createdAt']
        });

        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// 删除用户（管理员功能）
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: '用户不存在'
            });
        }

        // 删除用户头像
        if (user.avatar) {
            const avatarPath = path.join(__dirname, '..', process.env.UPLOAD_PATH, user.avatar);
            try {
                await fs.unlink(avatarPath);
            } catch (error) {
                console.log('删除头像失败:', error);
            }
        }

        await user.destroy();

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}; 