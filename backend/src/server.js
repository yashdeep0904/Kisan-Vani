import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import { setupVoiceSocket } from './websockets/voiceSocket.js';
import { connectDB } from './config/db.js';

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

// Wrap Express app with native HTTP server
const server = http.createServer(app);

// Bind Socket.io WebSockets directly to the running server
setupVoiceSocket(server);

// Start listening for HTTP & WebSocket connections
server.listen(PORT, () => {
  console.log(`KisanVaani Backend running securely on port ${PORT}`);
});