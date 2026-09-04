CREATE DATABASE IF NOT EXISTS ai_content_db;
USE ai_content_db;

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('draft', 'scheduled', 'published') DEFAULT 'draft',
    scheduled_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);