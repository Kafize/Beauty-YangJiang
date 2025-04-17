const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // 在实际生产环境中应该使用环境变量

// 用户注册
async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // 检查用户名是否已存在
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: '用户名或邮箱已存在' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 插入新用户
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: '注册成功',
            userId: result.insertId
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
}

// 用户登录
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // 查找用户
        const [users] = await pool.execute(
            'SELECT id, username, email, password_hash, role, status FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: '用户不存在' });
        }

        const user = users[0];

        // 检查用户状态
        if (user.status !== 'active') {
            return res.status(401).json({ message: '账户已被禁用' });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: '密码错误' });
        }

        // 更新最后登录时间
        await pool.execute(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [user.id]
        );

        // 生成JWT令牌
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
}

// 获取用户信息
async function getUserInfo(req, res) {
    try {
        const userId = req.user.userId; // 从JWT中获取

        const [users] = await pool.execute(
            'SELECT id, username, email, avatar_url, role, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: '用户不存在' });
        }

        const user = users[0];
        res.json({ user });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
}

// 更新用户信息
async function updateUserInfo(req, res) {
    try {
        const userId = req.user.userId;
        const { username, avatar_url } = req.body;

        // 检查用户名是否已被其他用户使用
        if (username) {
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE username = ? AND id != ?',
                [username, userId]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: '用户名已存在' });
            }
        }

        // 更新用户信息
        const updateFields = [];
        const updateValues = [];
        
        if (username) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }
        if (avatar_url) {
            updateFields.push('avatar_url = ?');
            updateValues.push(avatar_url);
        }

        if (updateFields.length > 0) {
            updateValues.push(userId);
            await pool.execute(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        res.json({ message: '用户信息更新成功' });
    } catch (error) {
        console.error('更新用户信息错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
}

module.exports = {
    register,
    login,
    getUserInfo,
    updateUserInfo
}; 