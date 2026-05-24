const Ticket = require('../models/Ticket');
const Book = require('../models/Book');
const User = require('../models/User');
const { processNewTicket, generateDraftResponse } = require('../utils/gemini');
const { notifyTicketUpdate, notifyNewTicket } = require('../utils/websocket');

// POST /api/tickets - Author: create new ticket
const createTicket = async (req, res, next) => {
  try {
    const { subject, description, book: bookId } = req.body;

    // Validate book ownership if book is provided
    let book = null;
    if (bookId) {
      book = await Book.findOne({ _id: bookId, author: req.user._id });
      if (!book) {
        return res.status(404).json({ success: false, message: 'Book not found or does not belong to you.' });
      }
    }

    // Create ticket first so author gets immediate response
    const ticket = await Ticket.create({
      author: req.user._id,
      book: bookId || null,
      subject,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Ticket submitted successfully. Our team will respond shortly.',
      data: { ticket }
    });

    // Process AI in background (non-blocking)
    try {
      const aiResults = await processNewTicket(
        { subject, description },
        req.user.name,
        book ? book.title : null
      );

      // Update ticket with AI results
      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticket._id,
        {
          category: aiResults.category,
          priority: aiResults.priority,
          aiDraftResponse: aiResults.aiDraftResponse,
          aiProcessed: aiResults.aiProcessed,
          aiError: aiResults.aiError
        },
        { new: true }
      ).populate('author', 'name email').populate('book', 'title isbn');

      // Notify all admins about new ticket
      const admins = await User.find({ role: 'admin', isActive: true });
      const adminIds = admins.map(a => a._id);
      notifyNewTicket(updatedTicket, adminIds);
    } catch (aiError) {
      console.error('Background AI processing error:', aiError.message);
      // Notify admins about new ticket even if AI fails
      try {
        const admins = await User.find({ role: 'admin', isActive: true });
        const adminIds = admins.map(a => a._id);
        notifyNewTicket(ticket, adminIds);
      } catch (_) {}
    }
  } catch (error) {
    next(error);
  }
};

// GET /api/tickets - Author: get their tickets
const getMyTickets = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { author: req.user._id };

    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Ticket.countDocuments(query);

    const tickets = await Ticket.find(query)
      .populate('book', 'title isbn genre')
      .populate('responses.responder', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out internal notes from responses for authors
    const sanitizedTickets = tickets.map(ticket => {
      const t = ticket.toObject();
      t.responses = t.responses.filter(r => !r.isInternal);
      return t;
    });

    res.json({
      success: true,
      count: sanitizedTickets.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: { tickets: sanitizedTickets }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tickets/:id - Author: get single ticket
const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('book', 'title isbn genre mrp')
      .populate('author', 'name email')
      .populate('responses.responder', 'name role')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    // Authors can only view their own tickets
    if (req.user.role === 'author' && ticket.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const ticketObj = ticket.toObject();

    // Filter internal notes for authors
    if (req.user.role === 'author') {
      ticketObj.responses = ticketObj.responses.filter(r => !r.isInternal);
    }

    res.json({ success: true, data: { ticket: ticketObj } });
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets/:id/respond - Author: add a follow-up message
const authorRespond = async (req, res, next) => {
  try {
    const { message } = req.body;

    const ticket = await Ticket.findOne({ _id: req.params.id, author: req.user._id });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    if (['Resolved', 'Closed'].includes(ticket.status)) {
      return res.status(400).json({ success: false, message: 'Cannot respond to a resolved or closed ticket.' });
    }

    ticket.responses.push({
      responder: req.user._id,
      responderRole: 'author',
      message,
      isInternal: false
    });

    // Reopen if resolved
    if (ticket.status === 'Resolved') ticket.status = 'Open';

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('responses.responder', 'name role');

    // Notify admins
    const admins = await User.find({ role: 'admin', isActive: true });
    notifyTicketUpdate(updatedTicket, admins.map(a => a._id));

    res.json({ success: true, message: 'Response added.', data: { ticket: updatedTicket } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket, getMyTickets, getTicket, authorRespond };
