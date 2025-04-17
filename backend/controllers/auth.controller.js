const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: '该邮箱已被注册'
      });
    }

    // 创建新用户
    const user = new User({ username, email, password });
    await User.create(user);

    res.status(201).json({
      status: 'success',
      message: '注册成功'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: '注册失败'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: '邮箱或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: '邮箱或密码错误'
      });
    }

    // 更新最后登录时间
    await User.updateLastLogin(user.id);

    // 生成JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: '登录失败'
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: '用户不存在'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          role: user.role,
          created_at: user.created_at,
          last_login: user.last_login
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: '获取用户信息失败'
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, avatar_url } = req.body;
    
    const success = await User.updateProfile(userId, { username, avatar_url });
    
    if (!success) {
      return res.status(400).json({
        status: 'error',
        message: '更新用户信息失败'
      });
    }
    
    res.json({
      status: 'success',
      message: '用户信息更新成功'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: '更新用户信息失败'
    });
  }
}; 