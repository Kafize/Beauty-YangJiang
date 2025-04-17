const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');

// 公开路由
router.post('/register', userController.register);
router.post('/login', userController.login);

// 需要认证的路由
router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/avatar', upload.single('avatar'), userController.updateAvatar);
router.put('/password', userController.updatePassword);

// 管理员路由
router.use(restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router; 