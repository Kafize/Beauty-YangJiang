const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// 配置文件存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
    },
    fileFilter: (req, file, cb) => {
        // 只允许图片文件
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件'));
        }
    }
});

// 确保上传目录存在
async function ensureUploadDir() {
    try {
        await fs.access('uploads');
    } catch {
        await fs.mkdir('uploads');
    }
}

// 上传文件
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '请选择要上传的文件' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            message: '文件上传成功',
            url: fileUrl
        });
    } catch (error) {
        console.error('文件上传失败:', error);
        res.status(500).json({ error: '文件上传失败，请稍后重试' });
    }
});

// 下载文件
router.get('/download/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../uploads', req.params.filename);
        await fs.access(filePath);
        res.download(filePath);
    } catch (error) {
        console.error('文件下载失败:', error);
        res.status(404).json({ error: '文件不存在' });
    }
});

// 删除文件
router.delete('/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../uploads', req.params.filename);
        await fs.unlink(filePath);
        res.json({ message: '文件删除成功' });
    } catch (error) {
        console.error('文件删除失败:', error);
        res.status(500).json({ error: '文件删除失败，请稍后重试' });
    }
});

// 初始化上传目录
ensureUploadDir();

module.exports = router; 