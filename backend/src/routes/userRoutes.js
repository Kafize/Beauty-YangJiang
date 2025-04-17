const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// 用户注册验证规则
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('用户名长度必须在2-20个字符之间'),
    body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('密码长度不能少于6个字符')
];

// 用户登录验证规则
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址'),
    body('password')
        .notEmpty()
        .withMessage('密码不能为空')
];

// 用户信息更新验证规则
const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 2, max: 20 })
        .withMessage('用户名长度必须在2-20个字符之间'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('请输入有效的邮箱地址'),
    body('phone')
        .optional()
        .matches(/^1[3-9]\d{9}$/)
        .withMessage('请输入有效的手机号码')
];

// 用户注册
router.post('/register', registerValidation, userController.register);

// 用户登录
router.post('/login', loginValidation, userController.login);

// 获取用户信息
router.get('/profile', authMiddleware, userController.getProfile);

// 更新用户信息
router.put('/profile', authMiddleware, updateProfileValidation, userController.updateProfile);

module.exports = router; 