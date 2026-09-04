const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// مسار توليد المحتوى
router.post('/generate', aiController.generateContent);

module.exports = router;
