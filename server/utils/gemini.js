// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // Initialize Gemini - only if API key is present
// let genAI = null;
// let model = null;

// const initGemini = () => {
//   if (!process.env.GEMINI_API_KEY) {
//     console.warn('⚠️  GEMINI_API_KEY not set. AI features will be disabled.');
//     return false;
//   }
//   genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // cost-efficient model
//   return true;
// };

// initGemini();

// // BookLeaf Knowledge Base - kept as a concise summary to reduce token usage
// const KNOWLEDGE_BASE = `
// BOOKLEAF PUBLISHING - SUPPORT KNOWLEDGE BASE

// Company: Self-publishing company operating in India and US. Processes 1,200+ books monthly.
// Packages: Standard Free (no upfront cost), Bestseller Breakthrough (premium, paid).

// ROYALTY POLICY:
// - 80/20 split: 80% net profit to author, 20% to BookLeaf
// - Net profit = MRP minus printing cost, platform commission, shipping
// - Paid quarterly, within 45 days of quarter end
// - Minimum payout threshold: ₹1,000 (rolls over if below)
// - Paid via bank transfer linked in author dashboard

// ISBN POLICY:
// - Unique ISBN assigned by BookLeaf per book
// - Registered under BookLeaf's publisher imprint
// - Author can get own imprint ISBN independently
// - ISBN errors treated as high-priority, escalated to production team

// PRINTING & QUALITY:
// - In-house printing + partners: Repro India, Epitome Books
// - Standard turnaround: 5–7 business days
// - Quality issues: free reprint after verification (author shares photos)

// DISTRIBUTION:
// - Platforms: Amazon India, Flipkart, Amazon US, Amazon UK, BookLeaf Store
// - New listings live within 7–10 business days after publication
// - "Currently Unavailable" = stock sync issue → re-sync within 24–48 hours

// PRODUCTION STAGES:
// Manuscript Received → Editing → Cover Design → Typesetting → Proofreading → ISBN Assignment → Printing → Distribution Setup → Published & Live
// (Delays common at Cover Design and Proofreading)

// COMMUNICATION TONE:
// - Empathetic and professional; authors are partners
// - Acknowledge concern before solutions
// - Be specific with numbers, dates, statuses
// - Own mistakes directly; no corporate deflection
// - Give clear timelines (e.g., "48 hours") not vague promises
// - End with clear next step
// `;

// // Classify ticket into a category
// const classifyTicket = async (subject, description) => {
//   if (!model) {
//     return { category: 'General Inquiry', error: 'AI service unavailable' };
//   }

//   try {
//     const prompt = `You are a support ticket classifier for BookLeaf Publishing.

// Classify this support ticket into EXACTLY ONE of these categories:
// - Royalty & Payments
// - ISBN & Metadata Issues
// - Printing & Quality
// - Distribution & Availability
// - Book Status & Production Updates
// - General Inquiry

// Ticket Subject: "${subject}"
// Ticket Description: "${description}"

// Respond with ONLY the category name, nothing else.`;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text().trim();

//     const validCategories = [
//       'Royalty & Payments',
//       'ISBN & Metadata Issues',
//       'Printing & Quality',
//       'Distribution & Availability',
//       'Book Status & Production Updates',
//       'General Inquiry'
//     ];

//     // Find best match
//     const matched = validCategories.find(cat =>
//       text.toLowerCase().includes(cat.toLowerCase())
//     );

//     return { category: matched || 'General Inquiry', error: null };
//   } catch (error) {
//     console.error('Gemini classification error:', error.message);
//     return { category: 'General Inquiry', error: error.message };
//   }
// };

// // Generate priority score for a ticket
// const generatePriority = async (subject, description, category) => {
//   if (!model) {
//     return { priority: 'Medium', error: 'AI service unavailable' };
//   }

//   try {
//     const prompt = `You are a support ticket priority scorer for BookLeaf Publishing.

// Assign a priority level to this support ticket:
// - Critical: Immediate action needed (e.g., legal threats, completely broken ISBN, 6+ months no royalty)
// - High: Urgent issue affecting author revenue or publication (e.g., missing royalty payment, quality defects on shipped copies)
// - Medium: Important but not immediately blocking (e.g., book unavailable on platform, production delays)
// - Low: Minor or informational queries (e.g., bio update, general questions, metadata tweaks)

// Category: ${category}
// Subject: "${subject}"
// Description: "${description}"

// Respond with ONLY one word: Critical, High, Medium, or Low.`;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text().trim();

//     const validPriorities = ['Critical', 'High', 'Medium', 'Low'];
//     const matched = validPriorities.find(p =>
//       text.toLowerCase().includes(p.toLowerCase())
//     );

//     return { priority: matched || 'Medium', error: null };
//   } catch (error) {
//     console.error('Gemini priority error:', error.message);
//     return { priority: 'Medium', error: error.message };
//   }
// };

// // Generate AI draft response
// const generateDraftResponse = async (ticket, authorName, bookTitle) => {
//   if (!model) {
//     return { draft: '', error: 'AI service unavailable' };
//   }

//   try {
//     // Only send relevant context to save tokens
//     const prompt = `You are a support representative at BookLeaf Publishing responding to an author.

// ${KNOWLEDGE_BASE}

// Author Name: ${authorName}
// ${bookTitle ? `Book Title: "${bookTitle}"` : 'Query Type: General / Account Level'}
// Ticket Category: ${ticket.category}
// Priority: ${ticket.priority}
// Subject: "${ticket.subject}"
// Author's Query: "${ticket.description}"

// Write a professional, empathetic response following BookLeaf's communication tone guidelines.
// - Start by addressing the author by name
// - Acknowledge their specific concern
// - Provide accurate information based on the knowledge base
// - Give specific timelines where applicable
// - End with a clear next step

// Keep the response concise (150-250 words). Do not use bullet points in the response.`;

//     const result = await model.generateContent(prompt);
//     const draft = result.response.text().trim();

//     return { draft, error: null };
//   } catch (error) {
//     console.error('Gemini draft response error:', error.message);
//     return { draft: '', error: error.message };
//   }
// };

// // Process all AI tasks for a new ticket in one round-trip when possible
// const processNewTicket = async (ticket, authorName, bookTitle) => {
//   const results = {
//     category: 'General Inquiry',
//     priority: 'Medium',
//     aiDraftResponse: '',
//     aiProcessed: false,
//     aiError: ''
//   };

//   if (!model) {
//     results.aiError = 'AI service unavailable - API key not configured';
//     return results;
//   }

//   try {
//     // Run classification and priority in parallel to save time
//     const [classResult, priorityResult] = await Promise.all([
//       classifyTicket(ticket.subject, ticket.description),
//       generatePriority(ticket.subject, ticket.description, 'General Inquiry')
//     ]);

//     results.category = classResult.category;
//     results.priority = priorityResult.priority;

//     // Generate draft with the now-known category and priority
//     const draftResult = await generateDraftResponse(
//       { ...ticket, category: classResult.category, priority: priorityResult.priority },
//       authorName,
//       bookTitle
//     );

//     results.aiDraftResponse = draftResult.draft;
//     results.aiProcessed = true;

//     if (classResult.error || priorityResult.error || draftResult.error) {
//       results.aiError = [classResult.error, priorityResult.error, draftResult.error]
//         .filter(Boolean).join('; ');
//     }
//   } catch (error) {
//     results.aiError = error.message;
//     console.error('processNewTicket error:', error.message);
//   }

//   return results;
// };

// module.exports = {
//   classifyTicket,
//   generatePriority,
//   generateDraftResponse,
//   processNewTicket
// };










const https = require('https');

// Initialize Groq - only if API key is present
let groqReady = false;


const grokkey = process.env.GROQ_API_KEY

console.log(grokkey)

const initGroq = () => {
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY not set. AI features will be disabled.');
    return false;
  }
  groqReady = true;
  console.log('✅ Groq AI initialized (llama-3.3-70b-versatile)');
  return true;
};

initGroq();

// ── Low-level Groq HTTP caller ───────────────────────────
// Groq uses OpenAI-compatible API so no SDK needed
const callGroq = (messages, maxTokens = 800) => {
  return new Promise((resolve, reject) => {
    if (!groqReady) {
      return reject(new Error('AI service unavailable'));
    }

    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens,
      temperature: 0.3   // lower = more consistent, factual responses
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            return reject(new Error(parsed.error.message || 'Groq API error'));
          }
          const text = parsed.choices?.[0]?.message?.content?.trim();
          if (!text) return reject(new Error('Empty response from Groq'));
          resolve(text);
        } catch (e) {
          reject(new Error('Failed to parse Groq response'));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Groq request timed out'));
    });

    req.write(body);
    req.end();
  });
};

// BookLeaf Knowledge Base - kept concise to reduce token usage
const KNOWLEDGE_BASE = `
BOOKLEAF PUBLISHING - SUPPORT KNOWLEDGE BASE

Company: Self-publishing company operating in India and US. Processes 1,200+ books monthly.
Packages: Standard Free (no upfront cost), Bestseller Breakthrough (premium, paid).

ROYALTY POLICY:
- 80/20 split: 80% net profit to author, 20% to BookLeaf
- Net profit = MRP minus printing cost, platform commission, shipping
- Paid quarterly, within 45 days of quarter end
- Minimum payout threshold: ₹1,000 (rolls over if below)
- Paid via bank transfer linked in author dashboard

ISBN POLICY:
- Unique ISBN assigned by BookLeaf per book
- Registered under BookLeaf's publisher imprint
- Author can get own imprint ISBN independently
- ISBN errors treated as high-priority, escalated to production team

PRINTING & QUALITY:
- In-house printing + partners: Repro India, Epitome Books
- Standard turnaround: 5–7 business days
- Quality issues: free reprint after verification (author shares photos)

DISTRIBUTION:
- Platforms: Amazon India, Flipkart, Amazon US, Amazon UK, BookLeaf Store
- New listings live within 7–10 business days after publication
- "Currently Unavailable" = stock sync issue, re-sync within 24-48 hours

PRODUCTION STAGES:
Manuscript Received → Editing → Cover Design → Typesetting → Proofreading → ISBN Assignment → Printing → Distribution Setup → Published & Live
(Delays common at Cover Design and Proofreading)

COMMUNICATION TONE:
- Empathetic and professional; authors are partners
- Acknowledge concern before solutions
- Be specific with numbers, dates, statuses
- Own mistakes directly; no corporate deflection
- Give clear timelines (e.g., "48 hours") not vague promises
- End with clear next step
`;

// Classify ticket into a category
const classifyTicket = async (subject, description) => {
  if (!groqReady) {
    return { category: 'General Inquiry', error: 'AI service unavailable' };
  }

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a support ticket classifier for BookLeaf Publishing. Respond with ONLY the category name, nothing else. No explanation, no punctuation, just the category name.'
      },
      {
        role: 'user',
        content: `Classify this support ticket into EXACTLY ONE of these categories:
- Royalty & Payments
- ISBN & Metadata Issues
- Printing & Quality
- Distribution & Availability
- Book Status & Production Updates
- General Inquiry

Ticket Subject: "${subject}"
Ticket Description: "${description}"

Respond with ONLY the category name, nothing else.`
      }
    ];

    const text = await callGroq(messages, 30);

    const validCategories = [
      'Royalty & Payments',
      'ISBN & Metadata Issues',
      'Printing & Quality',
      'Distribution & Availability',
      'Book Status & Production Updates',
      'General Inquiry'
    ];

    // Find best match
    const matched = validCategories.find(cat =>
      text.toLowerCase().includes(cat.toLowerCase())
    );

    return { category: matched || 'General Inquiry', error: null };
  } catch (error) {
    console.error('Groq classification error:', error.message);
    return { category: 'General Inquiry', error: error.message };
  }
};

// Generate priority score for a ticket
const generatePriority = async (subject, description, category) => {
  if (!groqReady) {
    return { priority: 'Medium', error: 'AI service unavailable' };
  }

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a support ticket priority scorer for BookLeaf Publishing. Respond with ONLY one word: Critical, High, Medium, or Low. Nothing else.'
      },
      {
        role: 'user',
        content: `Assign a priority level to this support ticket:
- Critical: Immediate action needed (e.g., legal threats, completely broken ISBN, 6+ months no royalty)
- High: Urgent issue affecting author revenue or publication (e.g., missing royalty payment, quality defects on shipped copies)
- Medium: Important but not immediately blocking (e.g., book unavailable on platform, production delays)
- Low: Minor or informational queries (e.g., bio update, general questions, metadata tweaks)

Category: ${category}
Subject: "${subject}"
Description: "${description}"

Respond with ONLY one word: Critical, High, Medium, or Low.`
      }
    ];

    const text = await callGroq(messages, 10);

    const validPriorities = ['Critical', 'High', 'Medium', 'Low'];
    const matched = validPriorities.find(p =>
      text.toLowerCase().includes(p.toLowerCase())
    );

    return { priority: matched || 'Medium', error: null };
  } catch (error) {
    console.error('Groq priority error:', error.message);
    return { priority: 'Medium', error: error.message };
  }
};

// Generate AI draft response
const generateDraftResponse = async (ticket, authorName, bookTitle) => {
  if (!groqReady) {
    return { draft: '', error: 'AI service unavailable' };
  }

  try {
    const messages = [
      {
        role: 'system',
        content: `You are a support representative at BookLeaf Publishing responding to an author.
Use this knowledge base to answer accurately:

${KNOWLEDGE_BASE}

Rules for your response:
- Start by addressing the author by their first name
- Acknowledge their specific concern first
- Provide accurate information based on the knowledge base
- Give specific timelines where applicable
- End with a clear next step
- Keep response between 150-250 words
- Write in plain paragraphs, no bullet points`
      },
      {
        role: 'user',
        content: `Write a support response for this ticket:

Author Name: ${authorName}
${bookTitle ? `Book Title: "${bookTitle}"` : 'Query Type: General / Account Level'}
Ticket Category: ${ticket.category}
Priority: ${ticket.priority}
Subject: "${ticket.subject}"
Author's Query: "${ticket.description}"

Write the response now.`
      }
    ];

    const draft = await callGroq(messages, 400);
    return { draft, error: null };
  } catch (error) {
    console.error('Groq draft response error:', error.message);
    return { draft: '', error: error.message };
  }
};

// Process all AI tasks for a new ticket in one round-trip when possible
const processNewTicket = async (ticket, authorName, bookTitle) => {
  const results = {
    category: 'General Inquiry',
    priority: 'Medium',
    aiDraftResponse: '',
    aiProcessed: false,
    aiError: ''
  };

  if (!groqReady) {
    results.aiError = 'AI service unavailable - GROQ_API_KEY not configured';
    return results;
  }

  try {
    // Run classification and priority in parallel to save time
    const [classResult, priorityResult] = await Promise.all([
      classifyTicket(ticket.subject, ticket.description),
      generatePriority(ticket.subject, ticket.description, 'General Inquiry')
    ]);

    results.category = classResult.category;
    results.priority = priorityResult.priority;

    // Generate draft with the now-known category and priority
    const draftResult = await generateDraftResponse(
      { ...ticket, category: classResult.category, priority: priorityResult.priority },
      authorName,
      bookTitle
    );

    results.aiDraftResponse = draftResult.draft;
    results.aiProcessed = true;

    if (classResult.error || priorityResult.error || draftResult.error) {
      results.aiError = [classResult.error, priorityResult.error, draftResult.error]
        .filter(Boolean).join('; ');
    }
  } catch (error) {
    results.aiError = error.message;
    console.error('processNewTicket error:', error.message);
  }

  return results;
};

module.exports = {
  classifyTicket,
  generatePriority,
  generateDraftResponse,
  processNewTicket
};
