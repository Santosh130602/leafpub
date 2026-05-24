const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Book = require('../models/Book');
const { generateDraftResponse } = require('../utils/gemini');
const { notifyTicketUpdate } = require('../utils/websocket');

// GET /api/admin/tickets - Get all tickets with filters
const getAllTickets = async (req, res, next) => {
  try {
    const {
      status, category, priority, assignedTo,
      page = 1, limit = 20, sort = '-createdAt',
      search
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (assignedTo === 'me') query.assignedTo = req.user._id;
    else if (assignedTo === 'unassigned') query.assignedTo = null;

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Ticket.countDocuments(query);

    const tickets = await Ticket.find(query)
      .populate('author', 'name email')
      .populate('book', 'title isbn')
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: tickets.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: { tickets }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/tickets/:id - Get ticket detail (admin)
const getTicketDetail = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('author', 'name email phone bio bankDetails')
      .populate('book', 'title isbn genre mrp status royalty sales')
      .populate('responses.responder', 'name role')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    res.json({ success: true, data: { ticket } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/tickets/:id - Update ticket (status, priority, category, assign)
const updateTicket = async (req, res, next) => {
  try {
    const { status, priority, category, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const updates = {};

    if (status) updates.status = status;

    if (priority) {
      updates.priority = priority;
      updates.priorityOverridden = true;
    }

    if (category) {
      updates.category = category;
      updates.categoryOverridden = true;
    }

    if (assignedTo === 'me') {
      updates.assignedTo = req.user._id;
    } else if (assignedTo === 'unassign') {
      updates.assignedTo = null;
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id, updates, { new: true }
    )
      .populate('author', 'name email')
      .populate('book', 'title isbn')
      .populate('assignedTo', 'name email')
      .populate('responses.responder', 'name role');

    // Notify author and admins
    const admins = await User.find({ role: 'admin', isActive: true });
    notifyTicketUpdate(updatedTicket, admins.map(a => a._id));

    res.json({ success: true, message: 'Ticket updated.', data: { ticket: updatedTicket } });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/tickets/:id/respond - Admin sends a response
const adminRespond = async (req, res, next) => {
  try {
    const { message, isInternal = false } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    ticket.responses.push({
      responder: req.user._id,
      responderRole: 'admin',
      message,
      isInternal: Boolean(isInternal)
    });

    // If not internal, mark as In Progress
    if (!isInternal && ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('author', 'name email')
      .populate('book', 'title isbn')
      .populate('assignedTo', 'name email')
      .populate('responses.responder', 'name role');

    // Notify author (if not internal note) and admins
    const admins = await User.find({ role: 'admin', isActive: true });
    if (!isInternal) {
      notifyTicketUpdate(updatedTicket, admins.map(a => a._id));
    } else {
      // Only notify admins for internal notes
      const adminIds = admins.map(a => a._id);
      adminIds.forEach(id => {
        const { sendToUser } = require('../utils/websocket');
        sendToUser(id.toString(), {
          type: 'TICKET_UPDATED',
          ticket: { _id: updatedTicket._id, ticketNumber: updatedTicket.ticketNumber }
        });
      });
    }

    res.json({ success: true, message: 'Response sent.', data: { ticket: updatedTicket } });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/tickets/:id/regenerate-draft - Re-generate AI draft
const regenerateDraft = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('author', 'name email')
      .populate('book', 'title isbn');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    // ✅ Pass full ticket object — category and priority are guaranteed from DB
    const { draft, error } = await generateDraftResponse(
      {
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category || 'General Inquiry',   // ← fallback
        priority: ticket.priority || 'Medium'             // ← fallback
      },
      ticket.author.name,
      ticket.book ? ticket.book.title : null
    );

    if (error && !draft) {
      return res.status(503).json({
        success: false,
        message: 'AI service temporarily unavailable. Please write the response manually.',
        error
      });
    }

    await Ticket.findByIdAndUpdate(ticket._id, { aiDraftResponse: draft });

    res.json({ success: true, data: { draft } });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/dashboard - Dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      criticalTickets,
      totalAuthors,
      totalBooks,
      recentTickets
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'Open' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: { $in: ['Resolved', 'Closed'] } }),
      Ticket.countDocuments({ priority: 'Critical', status: { $in: ['Open', 'In Progress'] } }),
      User.countDocuments({ role: 'author', isActive: true }),
      Book.countDocuments({ isActive: true }),
      Ticket.find({ status: { $in: ['Open', 'In Progress'] } })
        .populate('author', 'name email')
        .populate('book', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Category breakdown
    const categoryStats = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Priority breakdown
    const priorityStats = await Ticket.aggregate([
      { $match: { status: { $in: ['Open', 'In Progress'] } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          criticalTickets,
          totalAuthors,
          totalBooks
        },
        categoryStats,
        priorityStats,
        recentTickets
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/authors - List all authors
const getAllAuthors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'author', isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const authors = await User.find(query).sort({ name: 1 }).skip(skip).limit(parseInt(limit));

    // Get book and ticket counts per author
    const authorData = await Promise.all(authors.map(async (author) => {
      const [bookCount, ticketCount, openTickets] = await Promise.all([
        Book.countDocuments({ author: author._id }),
        Ticket.countDocuments({ author: author._id }),
        Ticket.countDocuments({ author: author._id, status: { $in: ['Open', 'In Progress'] } })
      ]);
      return { ...author.toObject(), bookCount, ticketCount, openTickets };
    }));

    res.json({ success: true, count: authorData.length, total, data: { authors: authorData } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTickets,
  getTicketDetail,
  updateTicket,
  adminRespond,
  regenerateDraft,
  getDashboardStats,
  getAllAuthors
};
