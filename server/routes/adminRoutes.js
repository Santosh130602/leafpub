const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketDetail,
  updateTicket,
  adminRespond,
  regenerateDraft,
  getDashboardStats,
  getAllAuthors
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { responseValidator, ticketUpdateValidator } = require('../middleware/validationMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketDetail);
router.put('/tickets/:id', ticketUpdateValidator, updateTicket);
router.post('/tickets/:id/respond', responseValidator, adminRespond);
router.post('/tickets/:id/regenerate-draft', regenerateDraft);
router.get('/authors', getAllAuthors);

module.exports = router;
