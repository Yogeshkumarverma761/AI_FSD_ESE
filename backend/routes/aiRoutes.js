const express = require('express');
const router = express.Router();
const { getAIRecommendation } = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

router.post('/recommend', auth, getAIRecommendation);

module.exports = router;
