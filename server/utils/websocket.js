const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

let wss = null;

// Map of userId -> Set of WebSocket connections
const clients = new Map();

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // Extract token from query string: ws://host/ws?token=xxx
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(1008, 'Token required');
      return;
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      ws.close(1008, 'Invalid token');
      return;
    }

    // Register this connection
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId).add(ws);

    console.log(`🔌 WS connected: user ${userId} (total: ${wss.clients.size})`);

    ws.on('close', () => {
      const userConns = clients.get(userId);
      if (userConns) {
        userConns.delete(ws);
        if (userConns.size === 0) {
          clients.delete(userId);
        }
      }
      console.log(`🔌 WS disconnected: user ${userId}`);
    });

    ws.on('error', (err) => {
      console.error('WS error:', err.message);
    });

    // Send welcome ping
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'WebSocket connected' }));
  });

  console.log('🔌 WebSocket server initialized');
};

// Send a message to a specific user
const sendToUser = (userId, data) => {
  const userStr = userId.toString();
  const userConns = clients.get(userStr);
  if (!userConns || userConns.size === 0) return;

  const message = JSON.stringify(data);
  userConns.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
};

// Broadcast to all admins
const broadcastToAdmins = (adminIds, data) => {
  adminIds.forEach(id => sendToUser(id.toString(), data));
};

// Notify about ticket update
const notifyTicketUpdate = (ticket, adminIds = []) => {
  // Notify the author
  sendToUser(ticket.author.toString(), {
    type: 'TICKET_UPDATED',
    ticket: {
      _id: ticket._id,
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      responses: ticket.responses
    }
  });

  // Notify all admins
  adminIds.forEach(adminId => {
    sendToUser(adminId.toString(), {
      type: 'TICKET_UPDATED',
      ticket: {
        _id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category
      }
    });
  });
};

// Notify admins about new ticket
const notifyNewTicket = (ticket, adminIds = []) => {
  adminIds.forEach(adminId => {
    sendToUser(adminId.toString(), {
      type: 'NEW_TICKET',
      ticket: {
        _id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        priority: ticket.priority,
        category: ticket.category,
        createdAt: ticket.createdAt
      }
    });
  });
};

module.exports = { initWebSocket, sendToUser, broadcastToAdmins, notifyTicketUpdate, notifyNewTicket };
