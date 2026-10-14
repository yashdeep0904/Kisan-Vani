import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import { setupVoiceSocket } from './websockets/voiceSocket.js';
import { connectDB } from './config/db.js'; 
// import dotenv from 'dotenv';
// dotenv.config();

// Connect to MongoDB
connectDB(); 

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

setupVoiceSocket(server);

server.listen(PORT, () => {
  console.log(`KisanVaani Backend running securely on port ${PORT}`);
});