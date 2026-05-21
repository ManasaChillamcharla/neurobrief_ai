const express = require('express');
const router = express.Router();
const { getNoteBySummaryId, saveNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

// Secure all study notes routes
router.use(protect);

router.get('/:summaryId', getNoteBySummaryId);
router.post('/', saveNote);

module.exports = router;
