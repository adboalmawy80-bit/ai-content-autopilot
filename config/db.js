const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// إنشاء الجدول تلقائياً بدون الحاجة لـ phpMyAdmin أو Clever Cloud
const initDB = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            topic VARCHAR(255) NOT NULL,
            platform VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            status ENUM('draft', 'scheduled', 'published') DEFAULT 'draft',
            scheduled_at DATETIME NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await promisePool.query(createTableQuery);
        console.log('✅ Connected to MySQL Database & Table is Ready');
    } catch (error) {
        console.error('❌ Database Initialization Error:', error.message);
    }
};

initDB();

module.exports = promisePool;
