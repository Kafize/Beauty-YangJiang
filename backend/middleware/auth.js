const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // 应该与authController中的相同

// 验证JWT令牌的中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '令牌无效或已过期' });
        }
        req.user = user;
        next();
    });
}

// 验证管理员权限的中间件
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: '需要管理员权限' });
    }
}

module.exports = {
    authenticateToken,
    isAdmin
}; 