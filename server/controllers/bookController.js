const Book = require('../models/Book');

// GET /api/books - Author: get their books
const getMyBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ author: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: books.length, data: { books } });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/:id - Get a single book (author must own it)
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('author', 'name email');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    // Authors can only view their own books
    if (req.user.role === 'author' && book.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: { book } });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/author/:authorId - Admin: get a specific author's books
const getAuthorBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ author: req.params.authorId, isActive: true })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: books.length, data: { books } });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/stats/summary - Author: royalty and sales summary
const getMySummary = async (req, res, next) => {
  try {
    const books = await Book.find({ author: req.user._id, isActive: true });

    const summary = books.reduce((acc, book) => {
      acc.totalBooks++;
      acc.totalCopiesSold += book.totalCopiesSold;
      acc.totalRoyaltyEarned += book.royalty.totalEarned;
      acc.totalRoyaltyPaid += book.royalty.totalPaid;
      acc.totalRoyaltyPending += book.royaltyPending;
      if (book.status === 'Published & Live') acc.publishedBooks++;
      return acc;
    }, {
      totalBooks: 0,
      publishedBooks: 0,
      totalCopiesSold: 0,
      totalRoyaltyEarned: 0,
      totalRoyaltyPaid: 0,
      totalRoyaltyPending: 0
    });

    res.json({ success: true, data: { summary } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyBooks, getBook, getAuthorBooks, getMySummary };
