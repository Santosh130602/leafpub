# BookLeaf Publishing — Author Support & Communication Portal

A full-stack web application providing an AI-powered support portal for BookLeaf Publishing authors and operations team.

---

## Live Demo

> Deploy URL: _(add after deployment)_

**Test Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bookleaf.com | admin123 |
| Admin 2 | rahul@bookleaf.com | admin123 |
| Author (Arjun Malhotra) | arjun.malhotra@email.com | author123 |
| Author (Meera Nair) | meera.nair@email.com | author123 |
| Author (Priya Sharma) | priya.sharma@email.com | author123 |
| Author (Vikram Joshi) | vikram.joshi@email.com| author123 |
| _(all authors)_ | _(name)_@author.com | author123 |

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | React 18 + React Router v6 | Fast SPA, familiar ecosystem |
| Backend | Node.js + Express | Lightweight, fast, ideal for REST APIs |
| Database | MongoDB + Mongoose | Flexible schema for nested responses/tickets |
| AI/LLM | Google Gemini 1.5 Flash | Cost-efficient, strong instruction following |
| Real-time | WebSockets (ws library) | Low-overhead bidirectional updates |
| Styling | Custom CSS with CSS variables | No build overhead, full control |
| Auth | JWT (jsonwebtoken) + bcryptjs | Stateless, scalable |

---

## Project Structure

```
└── 📁bookleaf
    └── 📁frontend
        └── 📁public
            ├── favicon.svg
            ├── icons.svg
        └── 📁src
            └── 📁assets
                ├── hero.png
                ├── react.svg
                ├── vite.svg
            └── 📁components
                └── 📁common
                    ├── AdminLayout.jsx
                    ├── AuthorLayout.jsx
            └── 📁context
                ├── AuthContext.jsx
            └── 📁hooks
                ├── useWebSocket.js
            └── 📁pages
                └── 📁admin
                    ├── AdminDashboard.jsx
                    ├── AdminTicketDetail.jsx
                    ├── AuthorsList.jsx
                    ├── TicketQueue.jsx
                └── 📁author
                    ├── AuthorDashboard.jsx
                    ├── MyBooks.jsx
                    ├── MyTickets.jsx
                    ├── SubmitTicket.jsx
                    ├── TicketDetail.jsx
                ├── LoginPage.jsx
                ├── RegisterPage.jsx
            └── 📁utils
                ├── api.js
                ├── helpers.js
            ├── App.css
            ├── App.jsx
            ├── index.css
            ├── main.jsx
        ├── .env
        ├── .gitignore
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── README.md
        ├── vite.config.js
    └── 📁server
        └── 📁controllers
            ├── adminController.js
            ├── authController.js
            ├── bookController.js
            ├── ticketController.js
        └── 📁middleware
            ├── authMiddleware.js
            ├── validationMiddleware.js
        └── 📁models
            ├── Book.js
            ├── Ticket.js
            ├── User.js
        └── 📁routes
            ├── adminRoutes.js
            ├── authRoutes.js
            ├── bookRoutes.js
            ├── ticketRoutes.js
            ├── userRoutes.js
        └── 📁utils
            ├── db.js
            ├── gemini.js
            ├── generateToken.js
            ├── seeder.js
            ├── websocket.js
        ├── .env
        ├── .env.example
        ├── .gitignore
        ├── bookleaf_sample_data.json
        ├── index.js
        ├── package-lock.json
        ├── package.json
    ├── .DS_Store
    ├── .gitignore
    ├── package.json
    └── README.md
```


---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- GROQ  API key (free tier available at https://console.groq.com/keys)

### 1. Clone and install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# server/.env
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bookleaf
JWT_SECRET=your_very_long_random_secret_here
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

```bash
# client/.env
cp client/.env.example client/.env
```

Edit `client/.env`:
```
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_WS_URL=ws://localhost:4000/ws
```

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates 10 authors, 18 books, 8 sample tickets with pre-built responses.

### 4. Run the app

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open http://localhost:5173

---

## API Documentation

### Authentication

All protected routes require: `Authorization: Bearer <token>`

#### POST /api/auth/register
Create a new user account.
```json
{ "name": "string", "email": "string", "password": "string", "role": "author|admin" }
```

#### POST /api/auth/login
```json
{ "email": "string", "password": "string" }
```
Returns: `{ user, token }`

#### GET /api/auth/me
Returns current user profile.

---

### Books (Author)

#### GET /api/books
Returns all books belonging to the authenticated author.

#### GET /api/books/summary
Returns aggregate stats: totalBooks, publishedBooks, totalCopiesSold, totalRoyaltyEarned, totalRoyaltyPaid, totalRoyaltyPending.

#### GET /api/books/:id
Returns a single book. Authors can only access their own books.

---

### Tickets (Author)

#### POST /api/tickets
Create a new support ticket.
```json
{ "subject": "string", "description": "string (min 20 chars)", "book": "bookId|null" }
```
AI classification, priority scoring, and draft response are generated asynchronously after the ticket is created (non-blocking).

#### GET /api/tickets
List author's own tickets. Query: `?status=Open&page=1&limit=20`

#### GET /api/tickets/:id
Single ticket with full response thread (internal notes filtered out).

#### POST /api/tickets/:id/respond
Author adds a follow-up message.
```json
{ "message": "string" }
```

---

### Admin

#### GET /api/admin/dashboard
Returns stats, category/priority breakdown, recent open tickets.

#### GET /api/admin/tickets
All tickets across all authors.
Query: `?status=&category=&priority=&assignedTo=me|unassigned&search=&page=1&limit=20`

#### GET /api/admin/tickets/:id
Full ticket detail including author profile, book data, all responses (including internal notes).

#### PUT /api/admin/tickets/:id
Update ticket fields. Overrides AI classification/priority and marks override flags.
```json
{ "status": "Open|In Progress|Resolved|Closed", "priority": "Critical|High|Medium|Low", "category": "...", "assignedTo": "me|unassign" }
```

#### POST /api/admin/tickets/:id/respond
Send response or internal note.
```json
{ "message": "string", "isInternal": false }
```

#### POST /api/admin/tickets/:id/regenerate-draft
Re-run AI draft generation for this ticket. Returns: `{ draft: "string" }`

#### GET /api/admin/authors
All authors with book and ticket counts.
Query: `?search=&page=1&limit=20`

---

## AI Integration

### Model
**Google Gemini 1.5 Flash** — chosen for:
- Very low cost per token (suitable for high-volume support)
- Strong instruction-following for structured outputs
- Fast response times for near-real-time draft generation

### Strategy

**1. Three Separate Prompts (Classification, Priority, Draft)**

Classification and priority are run in parallel (`Promise.all`) to save latency. Draft is generated after, using the now-known category and priority for better context.

**2. Token Efficiency**

The knowledge base is summarized into a concise ~400 token version instead of the full document. Only the relevant ticket fields (subject, description, category, priority, book title, author name) are sent — NOT the full ticket history or previous responses. This keeps costs low per request.

**3. Graceful Degradation**

- If `GEMINI_API_KEY` is not set: all AI features silently disable. Tickets are still created, admins can respond manually. No 500 errors.
- If the API is rate-limited or down: the ticket is saved first, AI results default to `General Inquiry / Medium`, and `aiError` is logged on the ticket.
- Admins can always regenerate the draft manually via the "Generate AI Draft" button.

**4. Override Support**

Admins can override AI-classified category and priority directly in the ticket detail view. Override flags (`categoryOverridden`, `priorityOverridden`) are stored on the ticket for audit.

---

## Real-Time Updates

WebSocket server runs on the same HTTP server at path `/ws`.

**Connection:** `ws://host/ws?token=<jwt>`

JWT is verified on connection. Each authenticated user's connections are tracked in a `Map<userId, Set<WebSocket>>`.

**Events:**
- `CONNECTED` — sent on successful handshake
- `NEW_TICKET` — broadcast to all admins when author submits a ticket (after AI processing)
- `TICKET_UPDATED` — sent to ticket author + all admins when status changes, response is added, or fields are updated

**Reconnection:** Client reconnects automatically after 3 seconds if disconnected unexpectedly.

---

## Known Limitations & Future Improvements

1. **File uploads:** Attachment UI is implemented but actual file storage (S3 or local disk) is not wired up. This would be the next step.
2. **Email notifications:** Authors and admins should receive email alerts. Would add Nodemailer/SendGrid integration.
3. **Pagination on WebSocket events:** Currently all admins receive all ticket events. In production, this would be scoped to relevant admins.
4. **AI prompt caching:** For frequently repeated queries, responses could be cached in Redis to further reduce Gemini API costs.
5. **Rate limiting:** API-level rate limiting (express-rate-limit) should be added before production deployment.
6. **Tests:** Unit tests for controllers and AI utils, integration tests for key API flows.
