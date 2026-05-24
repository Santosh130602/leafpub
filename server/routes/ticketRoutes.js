const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets, getTicket, authorRespond } = require('../controllers/ticketController');
const { protect, authorOnly } = require('../middleware/authMiddleware');
const { ticketValidator, responseValidator } = require('../middleware/validationMiddleware');

router.post('/', protect, ticketValidator, createTicket);
router.get('/', protect, getMyTickets);
router.get('/:id', protect, getTicket);
router.post('/:id/respond', protect, responseValidator, authorRespond);

module.exports = router;
