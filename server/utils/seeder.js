// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const Book = require('../models/Book');
// const Ticket = require('../models/Ticket');

// const seed = async () => {
//   await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookleaf');
//   console.log('Connected to MongoDB');

//   // Clear existing data
//   await User.deleteMany({});
//   await Book.deleteMany({});
//   await Ticket.deleteMany({});
//   console.log('Cleared existing data');

//   // Create admin
//   const admin = await User.create({
//     name: 'Priya Sharma',
//     email: 'admin@bookleaf.com',
//     password: 'admin123',
//     role: 'admin',
//     phone: '+91-9876543210'
//   });

//   const admin2 = await User.create({
//     name: 'Rahul Mehta',
//     email: 'rahul@bookleaf.com',
//     password: 'admin123',
//     role: 'admin',
//     phone: '+91-9876543211'
//   });

//   // Create 10 authors
//   const authorsData = [
//     { name: 'Arjun Kapoor', email: 'arjun@author.com', password: 'author123', phone: '+91-9811234567', bio: 'Award-winning fiction author from Mumbai.' },
//     { name: 'Meera Pillai', email: 'meera@author.com', password: 'author123', phone: '+91-9822345678', bio: 'Non-fiction writer specializing in Indian history.' },
//     { name: 'Vikram Nair', email: 'vikram@author.com', password: 'author123', phone: '+91-9833456789', bio: 'Thriller writer with 3 bestsellers.' },
//     { name: 'Sunita Reddy', email: 'sunita@author.com', password: 'author123', phone: '+91-9844567890', bio: 'Self-help author and life coach.' },
//     { name: 'Aditya Joshi', email: 'aditya@author.com', password: 'author123', phone: '+91-9855678901', bio: 'Science fiction enthusiast from Pune.' },
//     { name: 'Kavita Menon', email: 'kavita@author.com', password: 'author123', phone: '+91-9866789012', bio: 'Romance novelist with loyal readership.' },
//     { name: 'Rohit Gupta', email: 'rohit@author.com', password: 'author123', phone: '+91-9877890123', bio: 'Business and entrepreneurship writer.' },
//     { name: 'Anjali Singh', email: 'anjali@author.com', password: 'author123', phone: '+91-9888901234', bio: 'Children\'s book author and illustrator.' },
//     { name: 'Deepak Verma', email: 'deepak@author.com', password: 'author123', phone: '+91-9899012345', bio: 'Poetry and literary fiction author.' },
//     { name: 'Priya Patel', email: 'priya@author.com', password: 'author123', phone: '+91-9810123456', bio: 'Health and wellness author from Ahmedabad.' }
//   ];

//   const authors = await User.create(authorsData);
//   console.log(`Created ${authors.length} authors`);

//   // Create 18 books
//   const booksData = [
//     // Arjun Kapoor - 2 books
//     {
//       author: authors[0]._id,
//       title: 'Shadows of Mumbai',
//       isbn: '978-93-5000-001-1',
//       genre: 'Fiction',
//       publicationDate: new Date('2022-03-15'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 299,
//       printingCost: 80,
//       sales: { amazonIndia: 520, flipkart: 210, amazonUS: 85, amazonUK: 40, bookleafStore: 95 },
//       royalty: { totalEarned: 42350, totalPaid: 38000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[0]._id,
//       title: 'The Last Monsoon',
//       isbn: '978-93-5000-002-2',
//       genre: 'Literary Fiction',
//       publicationDate: new Date('2023-06-20'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 249,
//       printingCost: 70,
//       sales: { amazonIndia: 180, flipkart: 95, amazonUS: 30, amazonUK: 15, bookleafStore: 40 },
//       royalty: { totalEarned: 12400, totalPaid: 10000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Meera Pillai - 2 books
//     {
//       author: authors[1]._id,
//       title: 'Forgotten Empires of India',
//       isbn: '978-93-5000-003-3',
//       genre: 'Historical Fiction',
//       publicationDate: new Date('2021-11-10'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 399,
//       printingCost: 110,
//       sales: { amazonIndia: 890, flipkart: 420, amazonUS: 210, amazonUK: 95, bookleafStore: 180 },
//       royalty: { totalEarned: 118000, totalPaid: 118000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[1]._id,
//       title: 'Voices from the Deccan',
//       isbn: '978-93-5000-004-4',
//       genre: 'Non-Fiction',
//       publicationDate: new Date('2023-02-14'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 349,
//       printingCost: 95,
//       sales: { amazonIndia: 340, flipkart: 160, amazonUS: 75, amazonUK: 30, bookleafStore: 65 },
//       royalty: { totalEarned: 38200, totalPaid: 30000, lastPayoutDate: new Date('2023-07-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Vikram Nair - 2 books
//     {
//       author: authors[2]._id,
//       title: 'Code Red: Bangalore',
//       isbn: '978-93-5000-005-5',
//       genre: 'Thriller',
//       publicationDate: new Date('2022-08-01'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 349,
//       printingCost: 90,
//       sales: { amazonIndia: 1240, flipkart: 580, amazonUS: 320, amazonUK: 140, bookleafStore: 210 },
//       royalty: { totalEarned: 185000, totalPaid: 150000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[2]._id,
//       title: 'Silent Witness',
//       isbn: '978-93-5000-006-6',
//       genre: 'Mystery',
//       publicationDate: new Date('2023-09-05'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 299,
//       printingCost: 80,
//       sales: { amazonIndia: 290, flipkart: 130, amazonUS: 60, amazonUK: 25, bookleafStore: 55 },
//       royalty: { totalEarned: 22000, totalPaid: 0, lastPayoutDate: null, nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Sunita Reddy - 1 book
//     {
//       author: authors[3]._id,
//       title: 'Awaken Your Inner Leader',
//       isbn: '978-93-5000-007-7',
//       genre: 'Self-Help',
//       publicationDate: new Date('2022-01-20'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 279,
//       printingCost: 75,
//       sales: { amazonIndia: 2100, flipkart: 980, amazonUS: 540, amazonUK: 230, bookleafStore: 380 },
//       royalty: { totalEarned: 298000, totalPaid: 298000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Aditya Joshi - 2 books
//     {
//       author: authors[4]._id,
//       title: 'Mars Protocol',
//       isbn: '978-93-5000-008-8',
//       genre: 'Science Fiction',
//       publicationDate: new Date('2023-04-12'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 329,
//       printingCost: 85,
//       sales: { amazonIndia: 410, flipkart: 195, amazonUS: 110, amazonUK: 55, bookleafStore: 80 },
//       royalty: { totalEarned: 45000, totalPaid: 35000, lastPayoutDate: new Date('2023-07-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[4]._id,
//       title: 'Quantum Dreams',
//       isbn: '978-93-5000-009-9',
//       genre: 'Science Fiction',
//       publicationDate: new Date('2024-01-08'), // still in production
//       status: 'Typesetting',
//       publishingPackage: 'Standard Free',
//       mrp: 299,
//       printingCost: 80,
//       sales: { amazonIndia: 0, flipkart: 0, amazonUS: 0, amazonUK: 0, bookleafStore: 0 },
//       royalty: { totalEarned: 0, totalPaid: 0, lastPayoutDate: null, nextPayoutDate: null }
//     },
//     // Kavita Menon - 2 books
//     {
//       author: authors[5]._id,
//       title: 'Hearts Across the Himalayas',
//       isbn: '978-93-5000-010-0',
//       genre: 'Romance',
//       publicationDate: new Date('2021-07-14'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 249,
//       printingCost: 65,
//       sales: { amazonIndia: 3200, flipkart: 1500, amazonUS: 280, amazonUK: 120, bookleafStore: 450 },
//       royalty: { totalEarned: 390000, totalPaid: 390000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[5]._id,
//       title: 'When Stars Align',
//       isbn: '978-93-5000-011-1',
//       genre: 'Romance',
//       publicationDate: new Date('2023-11-28'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 249,
//       printingCost: 65,
//       sales: { amazonIndia: 95, flipkart: 40, amazonUS: 15, amazonUK: 8, bookleafStore: 20 },
//       royalty: { totalEarned: 5800, totalPaid: 0, lastPayoutDate: null, nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Rohit Gupta - 1 book
//     {
//       author: authors[6]._id,
//       title: 'Startup Dharma',
//       isbn: '978-93-5000-012-2',
//       genre: 'Business',
//       publicationDate: new Date('2022-10-05'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 499,
//       printingCost: 130,
//       sales: { amazonIndia: 780, flipkart: 360, amazonUS: 190, amazonUK: 85, bookleafStore: 160 },
//       royalty: { totalEarned: 210000, totalPaid: 180000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Anjali Singh - 2 books
//     {
//       author: authors[7]._id,
//       title: 'Coco and the Magic Garden',
//       isbn: '978-93-5000-013-3',
//       genre: 'Children',
//       publicationDate: new Date('2022-05-25'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 199,
//       printingCost: 60,
//       sales: { amazonIndia: 640, flipkart: 310, amazonUS: 90, amazonUK: 45, bookleafStore: 120 },
//       royalty: { totalEarned: 52000, totalPaid: 45000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[7]._id,
//       title: 'Raju and the Rainbow Bridge',
//       isbn: '978-93-5000-014-4',
//       genre: 'Children',
//       publicationDate: new Date('2023-12-01'), // still in production
//       status: 'Cover Design',
//       publishingPackage: 'Standard Free',
//       mrp: 199,
//       printingCost: 60,
//       sales: { amazonIndia: 0, flipkart: 0, amazonUS: 0, amazonUK: 0, bookleafStore: 0 },
//       royalty: { totalEarned: 0, totalPaid: 0, lastPayoutDate: null, nextPayoutDate: null }
//     },
//     // Deepak Verma - 1 book
//     {
//       author: authors[8]._id,
//       title: 'Verses from the Margins',
//       isbn: '978-93-5000-015-5',
//       genre: 'Poetry',
//       publicationDate: new Date('2023-01-30'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 199,
//       printingCost: 55,
//       sales: { amazonIndia: 120, flipkart: 55, amazonUS: 20, amazonUK: 10, bookleafStore: 30 },
//       royalty: { totalEarned: 8500, totalPaid: 0, lastPayoutDate: null, nextPayoutDate: new Date('2024-01-15') }
//     },
//     // Priya Patel - 3 books
//     {
//       author: authors[9]._id,
//       title: 'The Ayurveda Way',
//       isbn: '978-93-5000-016-6',
//       genre: 'Health & Wellness',
//       publicationDate: new Date('2021-09-18'),
//       status: 'Published & Live',
//       publishingPackage: 'Bestseller Breakthrough',
//       mrp: 349,
//       printingCost: 90,
//       sales: { amazonIndia: 1650, flipkart: 790, amazonUS: 420, amazonUK: 180, bookleafStore: 310 },
//       royalty: { totalEarned: 265000, totalPaid: 265000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[9]._id,
//       title: 'Mindful Living: A 30-Day Guide',
//       isbn: '978-93-5000-017-7',
//       genre: 'Self-Help',
//       publicationDate: new Date('2022-12-12'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 279,
//       printingCost: 75,
//       sales: { amazonIndia: 580, flipkart: 270, amazonUS: 140, amazonUK: 65, bookleafStore: 110 },
//       royalty: { totalEarned: 68000, totalPaid: 55000, lastPayoutDate: new Date('2023-07-15'), nextPayoutDate: new Date('2024-01-15') }
//     },
//     {
//       author: authors[9]._id,
//       title: 'Gut Health Revolution',
//       isbn: '978-93-5000-018-8',
//       genre: 'Health & Wellness',
//       publicationDate: new Date('2023-08-20'),
//       status: 'Published & Live',
//       publishingPackage: 'Standard Free',
//       mrp: 299,
//       printingCost: 80,
//       sales: { amazonIndia: 310, flipkart: 150, amazonUS: 80, amazonUK: 35, bookleafStore: 65 },
//       royalty: { totalEarned: 28500, totalPaid: 20000, lastPayoutDate: new Date('2023-10-15'), nextPayoutDate: new Date('2024-01-15') }
//     }
//   ];

//   const books = await Book.create(booksData);
//   console.log(`Created ${books.length} books`);

//   // Create sample tickets
//   const ticketsData = [
//     {
//       author: authors[0]._id,
//       book: books[0]._id,
//       subject: 'Royalty payment not received for Q3 2023',
//       description: 'I have been waiting for my Q3 royalty payment for Shadows of Mumbai. The quarter ended in September and it\'s been over 60 days. My bank details are correctly linked. Please look into this urgently.',
//       status: 'In Progress',
//       category: 'Royalty & Payments',
//       priority: 'High',
//       aiProcessed: true,
//       ticketNumber: 'BL-00001'
//     },
//     {
//       author: authors[2]._id,
//       book: books[5]._id,
//       subject: 'Silent Witness showing wrong ISBN on Amazon',
//       description: 'I just noticed that my book "Silent Witness" is showing a completely different ISBN on Amazon India than the one printed on the physical book. This is very concerning as it might affect sales and credibility. Please resolve this immediately.',
//       status: 'Open',
//       category: 'ISBN & Metadata Issues',
//       priority: 'Critical',
//       aiProcessed: true,
//       ticketNumber: 'BL-00002'
//     },
//     {
//       author: authors[1]._id,
//       book: books[3]._id,
//       subject: 'Book unavailable on Flipkart',
//       description: 'Voices from the Deccan has been showing as "Currently Unavailable" on Flipkart for the past 5 days. Several readers have messaged me saying they cannot purchase it. Please fix this as soon as possible.',
//       status: 'Resolved',
//       category: 'Distribution & Availability',
//       priority: 'Medium',
//       aiProcessed: true,
//       ticketNumber: 'BL-00003'
//     },
//     {
//       author: authors[4]._id,
//       book: books[8]._id,
//       subject: 'Quantum Dreams stuck in Typesetting for 3 weeks',
//       description: 'My manuscript for Quantum Dreams was submitted over 3 weeks ago and it has been stuck in the Typesetting stage. I have not received any updates from the team. What is the expected completion date? I have a launch event planned.',
//       status: 'Open',
//       category: 'Book Status & Production Updates',
//       priority: 'High',
//       aiProcessed: true,
//       ticketNumber: 'BL-00004'
//     },
//     {
//       author: authors[5]._id,
//       book: books[9]._id,
//       subject: 'Print quality issues with author copies',
//       description: 'I received my 10 author copies of Hearts Across the Himalayas and I am deeply disappointed. The cover images are blurry and several pages have misaligned text. The binding on 3 copies is also coming loose. This is not acceptable for a Bestseller Breakthrough package.',
//       status: 'In Progress',
//       category: 'Printing & Quality',
//       priority: 'High',
//       aiProcessed: true,
//       ticketNumber: 'BL-00005'
//     },
//     {
//       author: authors[8]._id,
//       book: null,
//       subject: 'Can I update my author bio across all platforms?',
//       description: 'I would like to update my author bio. The current bio is outdated and I want to add my new achievements and contact information. Can this be done and how long will it take to reflect across Amazon and Flipkart?',
//       status: 'Resolved',
//       category: 'General Inquiry',
//       priority: 'Low',
//       aiProcessed: true,
//       ticketNumber: 'BL-00006'
//     },
//     {
//       author: authors[6]._id,
//       book: books[11]._id,
//       subject: 'Royalty calculation seems incorrect - received much less than expected',
//       description: 'I sold approximately 780 copies on Amazon India alone at ₹499 MRP. My total royalty received was only ₹30,000 which seems very low. I would like a detailed breakdown of how this was calculated including printing costs and platform commissions.',
//       status: 'Open',
//       category: 'Royalty & Payments',
//       priority: 'High',
//       aiProcessed: true,
//       ticketNumber: 'BL-00007'
//     },
//     {
//       author: authors[9]._id,
//       book: books[15]._id,
//       subject: 'Request to update book description on Amazon',
//       description: 'I would like to update the book description for "The Ayurveda Way" on Amazon India and Amazon US. The current description is the original draft and I have a much better version now. Please let me know the process.',
//       status: 'Closed',
//       category: 'General Inquiry',
//       priority: 'Low',
//       aiProcessed: true,
//       ticketNumber: 'BL-00008'
//     }
//   ];

//   const tickets = await Ticket.create(ticketsData);

//   // Add responses to some tickets
//   await Ticket.findByIdAndUpdate(tickets[0]._id, {
//     $push: {
//       responses: {
//         responder: admin._id,
//         responderRole: 'admin',
//         message: 'Hi Arjun, thank you for reaching out. I have checked your royalty account for Shadows of Mumbai. Your Q3 earnings of ₹4,350 are confirmed and the payment is being processed. You should receive the bank transfer within 5 business days. I apologize for the delay beyond our standard 45-day window.',
//         isInternal: false,
//         createdAt: new Date()
//       }
//     }
//   });

//   await Ticket.findByIdAndUpdate(tickets[2]._id, {
//     $push: {
//       responses: [
//         {
//           responder: admin2._id,
//           responderRole: 'admin',
//           message: 'Hi Meera, we have identified a stock sync issue affecting the Flipkart listing for Voices from the Deccan. Our distribution team has triggered a manual re-sync. The book should be available again within 24-48 hours.',
//           isInternal: false,
//           createdAt: new Date(Date.now() - 86400000)
//         },
//         {
//           responder: admin2._id,
//           responderRole: 'admin',
//           message: 'Hi Meera, we are happy to confirm that Voices from the Deccan is now live on Flipkart again. The stock sync has been completed successfully. We apologize for the inconvenience.',
//           isInternal: false,
//           createdAt: new Date()
//         }
//       ]
//     }
//   });

//   await Ticket.findByIdAndUpdate(tickets[5]._id, {
//     $push: {
//       responses: {
//         responder: admin._id,
//         responderRole: 'admin',
//         message: 'Hi Deepak, absolutely! You can update your author bio by logging into your dashboard and editing your profile. Changes are submitted to our team and typically reflect across Amazon India, Flipkart, and other platforms within 3-5 business days. Feel free to make the update and let us know if you need any assistance.',
//         isInternal: false,
//         createdAt: new Date()
//       }
//     }
//   });

//   console.log(`Created ${tickets.length} tickets`);
//   console.log('\n✅ Seeding complete!');
//   console.log('\n📋 Test Credentials:');
//   console.log('Admin: admin@bookleaf.com / admin123');
//   console.log('Admin 2: rahul@bookleaf.com / admin123');
//   console.log('Authors:');
//   authorsData.forEach(a => console.log(`  ${a.name}: ${a.email} / ${a.password}`));

//   process.exit(0);
// };

// seed().catch(err => {
//   console.error('Seeding error:', err);
//   process.exit(1);
// });




require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Book = require('../models/Book');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Book.deleteMany({});
  console.log('Cleared existing data');

  // Create admin users
  const admin = await User.create({
    name: 'Priya Sharma',
    email: 'admin@bookleaf.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9876543210',
    bio: 'Senior Publishing Manager'
  });

  const admin2 = await User.create({
    name: 'Rahul Mehta',
    email: 'rahul@bookleaf.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9876543211',
    bio: 'Author Support Lead'
  });

  console.log('Created admin users');

  // Authors data from your JSON (only fields that exist in User model)
  const authorsData = [
    {
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91-98765-43210",
      bio: "Award-winning literary fiction author from Mumbai exploring contemporary Indian narratives.",
      books: [
        {
          title: "Whispers of the Ganges",
          isbn: "978-93-5XXXX-01-1",
          genre: "Literary Fiction",
          publicationDate: "2023-06-20",
          status: "Published & Live",
          mrp: 399,
          totalCopiesSold: 342,
          totalRoyaltyEarned: 11970,
          royaltyPaid: 8400,
          lastPayoutDate: "2025-10-15",
          availableOn: ["Amazon India", "Flipkart", "BookLeaf Store"]
        },
        {
          title: "The Saffron Diaries",
          isbn: "978-93-5XXXX-02-8",
          genre: "Non-Fiction",
          publicationDate: "2024-01-10",
          status: "Published & Live",
          mrp: 450,
          totalCopiesSold: 189,
          totalRoyaltyEarned: 7938,
          royaltyPaid: 7938,
          lastPayoutDate: "2025-12-01",
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Rohit Kapoor",
      email: "rohit.kapoor@email.com",
      phone: "+91-87654-32109",
      bio: "Tech entrepreneur turned author, writing about the intersection of technology and spirituality.",
      books: [
        {
          title: "Code & Karma",
          isbn: "978-93-5XXXX-03-5",
          genre: "Self-Help",
          publicationDate: "2023-02-14",
          status: "Published & Live",
          mrp: 350,
          totalCopiesSold: 876,
          totalRoyaltyEarned: 26280,
          royaltyPaid: 21000,
          lastPayoutDate: "2025-09-01",
          availableOn: ["Amazon India", "Flipkart", "Amazon US", "BookLeaf Store"]
        },
        {
          title: "Startup Sutra",
          isbn: "978-93-5XXXX-04-2",
          genre: "Business",
          publicationDate: "2024-05-22",
          status: "Published & Live",
          mrp: 499,
          totalCopiesSold: 1203,
          totalRoyaltyEarned: 57744,
          royaltyPaid: 50000,
          lastPayoutDate: "2025-11-15",
          availableOn: ["Amazon India", "Flipkart", "Amazon US", "Amazon UK", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Ananya Reddy",
      email: "ananya.reddy@email.com",
      phone: "+91-76543-21098",
      bio: "Historical fiction writer passionate about bringing forgotten Indian stories to life.",
      books: [
        {
          title: "Between Two Temples",
          isbn: "978-93-5XXXX-05-9",
          genre: "Historical Fiction",
          publicationDate: "2024-07-05",
          status: "Published & Live",
          mrp: 425,
          totalCopiesSold: 67,
          totalRoyaltyEarned: 2546,
          royaltyPaid: 0,
          lastPayoutDate: null,
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Vikram Joshi",
      email: "vikram.joshi@email.com",
      phone: "+91-65432-10987",
      bio: "Engineer by profession, poet by passion. Writing about life through code and verses.",
      books: [
        {
          title: "Debugging Life",
          isbn: "978-93-5XXXX-06-6",
          genre: "Self-Help",
          publicationDate: "2023-11-30",
          status: "Published & Live",
          mrp: 299,
          totalCopiesSold: 534,
          totalRoyaltyEarned: 13350,
          royaltyPaid: 10000,
          lastPayoutDate: "2025-08-20",
          availableOn: ["Amazon India", "Flipkart", "BookLeaf Store"]
        },
        {
          title: "The Last Monsoon",
          isbn: "978-93-5XXXX-07-3",
          genre: "Poetry",
          publicationDate: "2024-08-15",
          status: "Published & Live",
          mrp: 199,
          totalCopiesSold: 123,
          totalRoyaltyEarned: 1845,
          royaltyPaid: 1845,
          lastPayoutDate: "2025-12-01",
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Meera Nair",
      email: "meera.nair@email.com",
      phone: "+91-54321-09876",
      bio: "Storyteller from Kerala weaving tales of spice, sea, and human connections.",
      books: [
        {
          title: "Cardamom & Chaos",
          isbn: "978-93-5XXXX-08-0",
          genre: "Fiction",
          publicationDate: "2023-04-18",
          status: "Published & Live",
          mrp: 375,
          totalCopiesSold: 445,
          totalRoyaltyEarned: 14240,
          royaltyPaid: 14240,
          lastPayoutDate: "2025-12-01",
          availableOn: ["Amazon India", "Flipkart", "BookLeaf Store"]
        },
        {
          title: "Letters from Lakshadweep",
          isbn: "978-93-5XXXX-09-7",
          genre: "Non-Fiction",
          publicationDate: "2024-03-01",
          status: "Published & Live",
          mrp: 550,
          totalCopiesSold: 201,
          totalRoyaltyEarned: 11055,
          royaltyPaid: 8000,
          lastPayoutDate: "2025-10-15",
          availableOn: ["Amazon India", "Amazon US", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Arjun Malhotra",
      email: "arjun.malhotra@email.com",
      phone: "+91-43210-98765",
      bio: "Humorist and essayist celebrating the quirks of modern Indian life.",
      books: [
        {
          title: "Turban Tales",
          isbn: "978-93-5XXXX-10-3",
          genre: "Non-Fiction",
          publicationDate: "2024-09-10",
          status: "Published & Live",
          mrp: 325,
          totalCopiesSold: 88,
          totalRoyaltyEarned: 2464,
          royaltyPaid: 0,
          lastPayoutDate: null,
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Sneha Kulkarni",
      email: "sneha.kulkarni@email.com",
      phone: "+91-32109-87654",
      bio: "Romance novelist writing about love in the age of algorithms.",
      books: [
        {
          title: "The Algorithm of Love",
          isbn: "978-93-5XXXX-11-0",
          genre: "Romance",
          publicationDate: "2022-12-25",
          status: "Published & Live",
          mrp: 299,
          totalCopiesSold: 1567,
          totalRoyaltyEarned: 39175,
          royaltyPaid: 35000,
          lastPayoutDate: "2025-11-15",
          availableOn: ["Amazon India", "Flipkart", "Amazon US", "BookLeaf Store"]
        },
        {
          title: "Ctrl+Alt+Delete My Ex",
          isbn: "978-93-5XXXX-12-7",
          genre: "Romance",
          publicationDate: "2024-02-14",
          status: "Published & Live",
          mrp: 350,
          totalCopiesSold: 723,
          totalRoyaltyEarned: 21690,
          royaltyPaid: 18000,
          lastPayoutDate: "2025-10-15",
          availableOn: ["Amazon India", "Flipkart", "BookLeaf Store"]
        },
        {
          title: "Midnight in Mysore",
          isbn: "978-93-5XXXX-13-4",
          genre: "Thriller",
          publicationDate: null,
          status: "Cover Design",
          mrp: null,
          totalCopiesSold: 0,
          totalRoyaltyEarned: 0,
          royaltyPaid: 0,
          lastPayoutDate: null,
          availableOn: []
        }
      ]
    },
    {
      name: "Farhan Sheikh",
      email: "farhan.sheikh@email.com",
      phone: "+91-21098-76543",
      bio: "Preserving the rich tradition of Urdu poetry through contemporary expression.",
      books: [
        {
          title: "Ghazal of the Forgotten",
          isbn: "978-93-5XXXX-14-1",
          genre: "Poetry",
          publicationDate: "2024-01-26",
          status: "Published & Live",
          mrp: 250,
          totalCopiesSold: 156,
          totalRoyaltyEarned: 3120,
          royaltyPaid: 3120,
          lastPayoutDate: "2025-12-01",
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Kavita Deshmukh",
      email: "kavita.deshmukh@email.com",
      phone: "+91-10987-65432",
      bio: "Parenting expert sharing wisdom on raising children rooted in Indian values.",
      books: [
        {
          title: "Raising Roots",
          isbn: "978-93-5XXXX-15-8",
          genre: "Non-Fiction",
          publicationDate: null,
          status: "Typesetting",
          mrp: null,
          totalCopiesSold: 0,
          totalRoyaltyEarned: 0,
          royaltyPaid: 0,
          lastPayoutDate: null,
          availableOn: []
        },
        {
          title: "The Nagpur Notebooks",
          isbn: "978-93-5XXXX-16-5",
          genre: "Non-Fiction",
          publicationDate: "2024-11-05",
          status: "Published & Live",
          mrp: 299,
          totalCopiesSold: 34,
          totalRoyaltyEarned: 850,
          royaltyPaid: 0,
          lastPayoutDate: null,
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    },
    {
      name: "Diya Chatterjee",
      email: "diya.chatterjee@email.com",
      phone: "+91-09876-54321",
      bio: "Award-winning author exploring the complexities of modern Indian womanhood.",
      books: [
        {
          title: "Durga's Daughters",
          isbn: "978-93-5XXXX-17-2",
          genre: "Literary Fiction",
          publicationDate: "2023-10-15",
          status: "Published & Live",
          mrp: 475,
          totalCopiesSold: 612,
          totalRoyaltyEarned: 27540,
          royaltyPaid: 25000,
          lastPayoutDate: "2025-11-15",
          availableOn: ["Amazon India", "Flipkart", "Amazon US", "BookLeaf Store"]
        },
        {
          title: "Howrah Nights",
          isbn: "978-93-5XXXX-18-9",
          genre: "Thriller",
          publicationDate: "2025-01-20",
          status: "Published & Live",
          mrp: 399,
          totalCopiesSold: 45,
          totalRoyaltyEarned: 1575,
          royaltyPaid: 0,
          lastPayoutDate: null,
          availableOn: ["Amazon India", "BookLeaf Store"]
        }
      ]
    }
  ];

  // Helper function to distribute sales across platforms
  const distributeSales = (totalCopies, availableOn) => {
    const sales = {
      amazonIndia: 0,
      flipkart: 0,
      amazonUS: 0,
      amazonUK: 0,
      bookleafStore: 0
    };

    if (totalCopies === 0 || availableOn.length === 0) return sales;

    const hasAmazonIndia = availableOn.includes('Amazon India');
    const hasFlipkart = availableOn.includes('Flipkart');
    const hasAmazonUS = availableOn.includes('Amazon US');
    const hasAmazonUK = availableOn.includes('Amazon UK');
    const hasBookLeaf = availableOn.includes('BookLeaf Store');

    const platformCount = [hasAmazonIndia, hasFlipkart, hasAmazonUS, hasAmazonUK, hasBookLeaf].filter(Boolean).length;

    if (platformCount > 0) {
      if (hasAmazonIndia) sales.amazonIndia = Math.round(totalCopies * 0.5);
      if (hasFlipkart) sales.flipkart = Math.round(totalCopies * 0.25);
      if (hasAmazonUS) sales.amazonUS = Math.round(totalCopies * 0.12);
      if (hasAmazonUK) sales.amazonUK = Math.round(totalCopies * 0.08);
      if (hasBookLeaf) sales.bookleafStore = Math.round(totalCopies * 0.05);

      // Adjust to match total exactly
      let sum = Object.values(sales).reduce((a, b) => a + b, 0);
      if (sum !== totalCopies && totalCopies > 0) {
        sales.amazonIndia += (totalCopies - sum);
      }
    }

    return sales;
  };

  // Create authors and books
  let totalBooks = 0;

  for (const authorData of authorsData) {
    // Create author - only fields that exist in User model
    const author = await User.create({
      name: authorData.name,
      email: authorData.email,
      password: 'author123',
      role: 'author',
      phone: authorData.phone,
      bio: authorData.bio
    });

    console.log(`✅ Created author: ${authorData.name}`);

    // Create books for this author
    for (const bookData of authorData.books) {
      // Determine publishing package based on total copies sold
      const publishingPackage = bookData.totalCopiesSold > 500 ? 'Bestseller Breakthrough' : 'Standard Free';

      // Calculate printing cost (typically 20-25% of MRP)
      const printingCost = bookData.mrp ? Math.round(bookData.mrp * 0.22) : 0;

      // Distribute sales across platforms
      const sales = distributeSales(bookData.totalCopiesSold, bookData.availableOn);

      // Prepare royalty object
      const royalty = {
        totalEarned: bookData.totalRoyaltyEarned,
        totalPaid: bookData.royaltyPaid,
        lastPayoutDate: bookData.lastPayoutDate ? new Date(bookData.lastPayoutDate) : null,
        nextPayoutDate: (bookData.totalRoyaltyEarned > bookData.royaltyPaid) ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      };

      await Book.create({
        author: author._id,
        title: bookData.title,
        isbn: bookData.isbn,
        genre: bookData.genre,
        publicationDate: bookData.publicationDate ? new Date(bookData.publicationDate) : new Date(),
        status: bookData.status,
        publishingPackage: publishingPackage,
        mrp: bookData.mrp || 0,
        printingCost: printingCost,
        sales: sales,
        royalty: royalty,
        description: `${bookData.title} by ${authorData.name} - Available on ${bookData.availableOn.join(', ')}`,
        pages: Math.floor(Math.random() * 300) + 150,
        language: 'English'
      });

      totalBooks++;
      console.log(`  📚 Created book: "${bookData.title}"`);
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Admins: 2`);
  console.log(`   - Authors: ${authorsData.length}`);
  console.log(`   - Books: ${totalBooks}`);
  console.log(`\n🔐 Test Credentials:`);
  console.log(`   Admin: admin@bookleaf.com / admin123`);
  console.log(`   Admin 2: rahul@bookleaf.com / admin123`);
  console.log(`   All Authors: password is "author123"`);
  console.log(`\n   Sample authors:`);
  authorsData.slice(0, 5).forEach(a => {
    console.log(`   - ${a.name}: ${a.email} / author123`);
  });

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});










// santosh @Santoshs-MacBook - Air bookleaf % curl https://api.groq.com/openai/v1/models \
// -H "Authorization: Bearer gsk_B300Bo4ue9rtrgdfgdfogdWGdyb3FYdsfssgfdgt67dfdfs"
// { "object": "list", "data": [{ "id": "openai/gpt-oss-20b", "object": "model", "created": 1754407957, "owned_by": "OpenAI", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 65536 }, { "id": "groq/compound", "object": "model", "created": 1756949530, "owned_by": "Groq", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 8192 }, { "id": "llama-3.1-8b-instant", "object": "model", "created": 1693721698, "owned_by": "Meta", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 131072 }, { "id": "meta-llama/llama-prompt-guard-2-86m", "object": "model", "created": 1748632165, "owned_by": "Meta", "active": true, "context_window": 512, "public_apps": null, "max_completion_tokens": 512 }, { "id": "whisper-large-v3-turbo", "object": "model", "created": 1728413088, "owned_by": "OpenAI", "active": true, "context_window": 448, "public_apps": null, "max_completion_tokens": 448 }, { "id": "meta-llama/llama-prompt-guard-2-22m", "object": "model", "created": 1748632101, "owned_by": "Meta", "active": true, "context_window": 512, "public_apps": null, "max_completion_tokens": 512 }, { "id": "qwen/qwen3-32b", "object": "model", "created": 1748396646, "owned_by": "Alibaba Cloud", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 40960 }, { "id": "llama-3.3-70b-versatile", "object": "model", "created": 1733447754, "owned_by": "Meta", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 32768 }, { "id": "openai/gpt-oss-safeguard-20b", "object": "model", "created": 1761708789, "owned_by": "OpenAI", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 65536 }, { "id": "canopylabs/orpheus-arabic-saudi", "object": "model", "created": 1765926439, "owned_by": "Canopy Labs", "active": true, "context_window": 4000, "public_apps": null, "max_completion_tokens": 50000 }, { "id": "groq/compound-mini", "object": "model", "created": 1756949707, "owned_by": "Groq", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 8192 }, { "id": "allam-2-7b", "object": "model", "created": 1737672203, "owned_by": "SDAIA", "active": true, "context_window": 4096, "public_apps": null, "max_completion_tokens": 4096 }, { "id": "openai/gpt-oss-120b", "object": "model", "created": 1754408224, "owned_by": "OpenAI", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 65536 }, { "id": "whisper-large-v3", "object": "model", "created": 1693721698, "owned_by": "OpenAI", "active": true, "context_window": 448, "public_apps": null, "max_completion_tokens": 448 }, { "id": "canopylabs/orpheus-v1-english", "object": "model", "created": 1766186316, "owned_by": "Canopy Labs", "active": true, "context_window": 4000, "public_apps": null, "max_completion_tokens": 50000 }, { "id": "meta-llama/llama-4-scout-17b-16e-instruct", "object": "model", "created": 1743874824, "owned_by": "Meta", "active": true, "context_window": 131072, "public_apps": null, "max_completion_tokens": 8192 }] }
// santosh @Santoshs-MacBook - Air bookleaf % 