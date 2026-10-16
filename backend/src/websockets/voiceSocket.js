import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const setupVoiceSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://kisan-vani-client.onrender.com'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Voice Gateway] Client Connected: ${socket.id}`);
    let audioChunks = [];

    // 1. Buffer incoming raw audio chunks from the browser
    socket.on('audio_chunk', (chunk) => {
      // Ensure the incoming chunk is treated as a Buffer
      audioChunks.push(Buffer.from(chunk));
    });

    // 2. Process complete user audio session with Gemini AI
    socket.on('end_speech_session', async () => {
      try {
        socket.emit('ai_thinking');

        if (!ai) throw new Error('GEMINI_API_KEY is missing.');
        if (audioChunks.length === 0) throw new Error('No audio received. Please check your microphone.');

        // 3. Combine all chunks into a single audio file and convert to Base64
        const audioBuffer = Buffer.concat(audioChunks);
        const base64Audio = audioBuffer.toString('base64');

        // 4. Update the prompt to instruct the AI to actively listen to the file
        const prompt = `You are a Technical Interview Copilot. 
Listen to the attached audio response from the candidate. 
First, briefly acknowledge exactly what they just said.
Then, ask a sharp follow-up interview question based on their answer.
If they didn't say anything technical, guide them back to software engineering.
Keep your response concise (maximum 2 to 3 sentences) so it can be spoken fluently over audio.`;

        // 5. Send BOTH the text prompt and the audio file to Gemini
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            prompt,
            {
              inlineData: {
                mimeType: 'audio/webm',
                data: base64Audio
              }
            }
          ],
        });

        const replyText = response.text || "I couldn't quite hear that. Could you elaborate on your architecture?";

        // Emit AI response back to client
        socket.emit('ai_response', { text: replyText });
        audioChunks = []; // Clear buffer for the next answer

      } catch (err) {
        console.error('[Voice Gateway Error]:', err.message);
        socket.emit('ai_error', { error: err.message || 'Failed to process voice session.' });
        audioChunks = []; // Clear buffer on error
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Voice Gateway] Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};