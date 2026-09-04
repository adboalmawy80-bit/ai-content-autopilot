// Import database connection
const db = require('../config/db');

// Import encryption utilities
const { encrypt, decrypt } = require('../utils/crypto');

// Create and store a new post safely
exports.createPost = async (req, res) => {
    const { topic, platform, content, status } = req.body;

    // Check required fields
    if (!topic || !platform || !content) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        // Encrypt the content before saving to database
        const encryptedContent = encrypt(content);

        // SQL Query to insert new post
        const query = `INSERT INTO posts (topic, platform, content, status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(query, [topic, platform, encryptedContent, status || 'draft']);

        res.json({ success: true, message: 'Post stored securely!', postId: result.insertId });
    } catch (error) {
        console.error('❌ Post Save Error:', error.message);
        res.status(500).json({ success: false, error: 'Database Security Violation' });
    }
};

// Fetch and decrypt all saved posts
exports.getAllPosts = async (req, res) => {
    try {
        // Fetch posts sorted by creation date
        const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        
        // Decrypt text content for user view
        const decryptedPosts = posts.map(post => ({
            ...post,
            content: decrypt(post.content)
        }));

        res.json({ success: true, posts: decryptedPosts });
    } catch (error) {
        console.error('❌ Fetch Error:', error.message);
        res.status(500).json({ success: false, error: 'Failed to retrieve secure data' });
    }
};
