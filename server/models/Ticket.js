const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responderRole: {
    type: String,
    enum: ['author', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isInternal: {
    type: Boolean,
    default: false   // internal notes not shown to author
  }
}, {
  timestamps: true
});

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    default: null   // null = General / Account Level
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  // AI-generated fields
  category: {
    type: String,
    enum: [
      'Royalty & Payments',
      'ISBN & Metadata Issues',
      'Printing & Quality',
      'Distribution & Availability',
      'Book Status & Production Updates',
      'General Inquiry'
    ],
    default: 'General Inquiry'
  },
  categoryOverridden: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  priorityOverridden: {
    type: Boolean,
    default: false
  },
  aiDraftResponse: {
    type: String,
    default: ''
  },
  aiProcessed: {
    type: Boolean,
    default: false
  },
  aiError: {
    type: String,
    default: ''
  },
  // Admin fields
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  responses: [responseSchema],
  // Attachment (UI only, store metadata)
  attachment: {
    filename: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    size: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Auto-generate ticket number before saving
ticketSchema.pre('save', async function (next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketNumber = `BL-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
