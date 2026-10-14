import { WebSocketServer } from 'ws';

export const setupVoiceSocket = (server) => {
  const wss = new WebSocketServer({ server, path: '/api/voice' });

  wss.on('connection', (ws) => {
    console.log('Farmer connected to voice stream');
    
    ws.on('message', (message) => {
      // In a full implementation, this buffer is piped to the Gemini Live WebSocket
      console.log(`Received audio chunk of size: ${message.length} bytes`);
    });

    ws.on('close', () => {
      console.log('Voice stream disconnected');
    });
  });
};