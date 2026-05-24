const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: [
      'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance',
      'Science Fiction', 'Fantasy', 'Biography', 'Self-Help',
      'Business', 'Children', 'Poetry', 'Horror', 'Historical Fiction',
      'Literary Fiction', 'Spirituality', 'Health & Wellness', 'Other'
    ]
  },
  publicationDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: [
      'Manuscript Received',
      'Editing',
      'Cover Design',
      'Typesetting',
      'Proofreading',
      'ISBN Assignment',
      'Printing',
      'Distribution Setup',
      'Published & Live'
    ],
    default: 'Manuscript Received'
  },
  publishingPackage: {
    type: String,
    enum: ['Standard Free', 'Bestseller Breakthrough'],
    default: 'Standard Free'
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  printingCost: {
    type: Number,
    default: 0
  },
  coverImageUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number,
    default: 0
  },
  // Sales & Royalty Data
  sales: {
    amazonIndia: { type: Number, default: 0 },
    flipkart: { type: Number, default: 0 },
    amazonUS: { type: Number, default: 0 },
    amazonUK: { type: Number, default: 0 },
    bookleafStore: { type: Number, default: 0 }
  },
  royalty: {
    totalEarned: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    lastPayoutDate: { type: Date, default: null },
    nextPayoutDate: { type: Date, default: null }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: total copies sold
bookSchema.virtual('totalCopiesSold').get(function () {
  const s = this.sales;
  return (s.amazonIndia || 0) + (s.flipkart || 0) + (s.amazonUS || 0) + (s.amazonUK || 0) + (s.bookleafStore || 0);
});

// Virtual: royalty pending
bookSchema.virtual('royaltyPending').get(function () {
  return (this.royalty.totalEarned || 0) - (this.royalty.totalPaid || 0);
});

module.exports = mongoose.model('Book', bookSchema);
