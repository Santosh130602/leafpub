const express = require('express');
const router = express.Router();
const { getMyBooks, getBook, getAuthorBooks, getMySummary } = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getMyBooks);
router.get('/summary', protect, getMySummary);
router.get('/author/:authorId', protect, adminOnly, getAuthorBooks);
router.get('/:id', protect, getBook);

module.exports = router;
