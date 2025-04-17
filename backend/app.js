const express = require('express');
const cors = require('cors');
const path = require('path');
const { testConnection } = require('./config/database');
const authController = require('./controllers/auth.controller');
const authenticateToken = require('./middleware/auth.middleware');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));
app.use('/styles', express.static(path.join(__dirname, '../frontend/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../frontend/scripts')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 数据库连接配置
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'yjyw'
});

// 连接数据库
db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功');
});

// 获取景点列表
app.get('/api/scenic-spots', async (req, res) => {
  try {
    const [spots] = await db.promise().query(
      'SELECT * FROM scenic_spots ORDER BY visit_count DESC'
    );
    res.json(spots);
  } catch (error) {
    console.error('获取景点列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取景点详情
app.get('/api/scenic-spots/:id', async (req, res) => {
  try {
    const [spots] = await db.promise().query(
      'SELECT * FROM scenic_spots WHERE id = ?',
      [req.params.id]
    );
    
    if (spots.length === 0) {
      return res.status(404).json({ message: '景点不存在' });
    }
    
    // 更新访问次数
    await db.promise().query(
      'UPDATE scenic_spots SET visit_count = visit_count + 1 WHERE id = ?',
      [req.params.id]
    );
    
    res.json(spots[0]);
  } catch (error) {
    console.error('获取景点详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建景点
app.post('/api/scenic-spots', async (req, res) => {
  const { name, description, location, image_url } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授权' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    await db.promise().query(
      'INSERT INTO scenic_spots (name, description, location, image_url) VALUES (?, ?, ?, ?)',
      [name, description, location, image_url]
    );
    
    res.status(201).json({ message: '景点创建成功' });
  } catch (error) {
    console.error('创建景点错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取活动列表
app.get('/api/activities', async (req, res) => {
  try {
    const [activities] = await db.promise().query(
      'SELECT * FROM activities ORDER BY start_date ASC'
    );
    res.json(activities);
  } catch (error) {
    console.error('获取活动列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取活动详情
app.get('/api/activities/:id', async (req, res) => {
  try {
    const [activities] = await db.promise().query(
      'SELECT * FROM activities WHERE id = ?',
      [req.params.id]
    );
    
    if (activities.length === 0) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    res.json(activities[0]);
  } catch (error) {
    console.error('获取活动详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建活动
app.post('/api/activities', async (req, res) => {
  const { title, description, start_date, end_date, location } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授权' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    await db.promise().query(
      'INSERT INTO activities (title, description, start_date, end_date, location) VALUES (?, ?, ?, ?, ?)',
      [title, description, start_date, end_date, location]
    );
    
    res.status(201).json({ message: '活动创建成功' });
  } catch (error) {
    console.error('创建活动错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户注册
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  try {
    // 检查用户是否已存在
    const [existingUsers] = await db.promise().query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    await db.promise().query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 查找用户
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    const user = users[0];
    
    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取文章列表
app.get('/api/articles', async (req, res) => {
  try {
    const [articles] = await db.promise().query(`
      SELECT a.*, u.username as author_name 
      FROM articles a 
      JOIN users u ON a.author_id = u.id 
      ORDER BY a.created_at DESC
    `);
    res.json(articles);
  } catch (error) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建文章
app.post('/api/articles', async (req, res) => {
  const { title, content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授权' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    await db.promise().query(
      'INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)',
      [title, content, decoded.userId]
    );
    
    res.status(201).json({ message: '文章创建成功' });
  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 认证路由
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/user', authenticateToken, authController.getUserInfo);
app.put('/api/auth/user', authenticateToken, authController.updateUserInfo);

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/scenic-spots', require('./routes/scenic-spots'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/favorites', require('./routes/favorites'));

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// 受保护的路由示例
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ 
    status: 'success',
    message: '你已成功访问受保护的路由',
    user: req.user 
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;

// 初始化数据库并启动服务器
testConnection()
  .then(success => {
    if (success) {
      app.listen(PORT, () => {
        console.log(`服务器运行在 http://localhost:${PORT}`);
      });
    } else {
      console.error('数据库初始化失败，服务器未启动');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('启动服务器时发生错误:', err);
    process.exit(1);
  }); 