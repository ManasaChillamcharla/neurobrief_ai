const express = require('express');
const router = express.Router();
const { 
  createSummaryFromText, 
  createSummaryFromUpload, 
  getAllSummaries, 
  getSummaryById, 
  deleteSummary, 
  searchSummaries 
} = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Secure all summary routes with JWT protection
router.use(protect);

router.post('/text', createSummaryFromText);
router.post('/upload', upload.single('file'), createSummaryFromUpload);
router.get('/', getAllSummaries);
router.get('/:id', getSummaryById);
router.delete('/:id', deleteSummary);
router.post('/search', searchSummaries);

module.exports = router;
