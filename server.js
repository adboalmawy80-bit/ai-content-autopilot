const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// استدعاء قاعدة البيانات والتشفير
const dbPool = require('./config/db'); // أو مسار ملف الاتصال عندك
const { encryptText, decryptText } = require('./utils/crypto');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// API تسجيل الدخول
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === 'admin' && password === 'admin123') {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                user: { name: 'Admin', role: 'System Administrator' }
            });
        }
        return res.status(401).json({
            success: false,
            message: 'بيانات الدخول غير صحيحة! يرجى التأكد من اسم المستخدم وكلمة السر.'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// API حفظ وحماية المنشورات بتشفير AES-256 في MySQL
app.post('/api/posts', async (req, res) => {
    try {
        const { topic, platform, content } = req.body;
        if (!topic || !content) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        const encryptedTopic = encryptText(topic);
        const encryptedContent = encryptText(content);

        const [result] = await dbPool.query(
            'INSERT INTO posts (topic, platform, content) VALUES (?, ?, ?)',
            [encryptedTopic, platform || 'LinkedIn', encryptedContent]
        );

        res.json({ success: true, insertId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// API قراءة وفك تشفير المنشورات من MySQL
app.get('/api/posts', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM posts ORDER BY created_at DESC');
        const decryptedPosts = rows.map(post => ({
            ...post,
            topic: decryptText(post.topic),
            content: decryptText(post.content)
        }));
        res.json({ success: true, posts: decryptedPosts });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running securely on http://localhost:${PORT}`);
});