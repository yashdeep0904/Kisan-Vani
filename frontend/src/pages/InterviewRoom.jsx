import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Mic, MicOff, BrainCircuit, Loader2, Volume2, UserCheck, Bot } from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function InterviewRoom() {
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome to your AI Technical Interview! Click "Start Live Audio" and ask or answer a question.' }
  ]);

  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Native Speech Synthesis (Text-to-Speech)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous ongoing audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    socketRef.current.on('ai_thinking', () => {
      setIsAiThinking(true);
    });

    // Handle incoming AI response
    socketRef.current.on('ai_response', (data) => {
      setIsAiThinking(false);
      setMessages((prev) => [...prev, { sender: 'ai', text: data.text }]);
      speakText(data.text); // Play audio response
    });

    socketRef.current.on('ai_error', (data) => {
      setIsAiThinking(false);
      alert(`AI Error: ${data.error}`);
    });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      socketRef.current?.disconnect();
    };
  }, []);

  const toggleMicrophone = async () => {
    if (isRecording) {
      // Stop media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      setIsRecording(false);

      // Add user transcript entry & notify server to process speech
      setMessages((prev) => [...prev, { sender: 'user', text: '🎤 [Audio Response Sent]' }]);
      socketRef.current?.emit('end_speech_session');
      return;
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Mute AI while user speaks
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0 && socketRef.current?.connected) {
          socketRef.current.emit('audio_chunk', event.data);
        }
      };

      recorder.start(250);
      setIsRecording(true);

    } catch (err) {
      console.error('Microphone error:', err);
      alert('Please allow microphone permissions to begin.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 flex flex-col items-center">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Technical Interview Copilot
        </h1>
        <div className="text-sm text-slate-400 flex items-center justify-center gap-2">
          {!isConnected ? (
            <>
              <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
              <span>Connecting to gateway...</span>
            </>
          ) : (
            <span>Live WebSockets Active ✅</span>
          )}
        </div>
      </div>

      {/* Voice Visualizer Core */}
      <div className={`h-44 w-44 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-2xl relative ${
        isRecording 
          ? 'border-rose-500 bg-rose-500/10 shadow-rose-500/30 animate-pulse' 
          : isAiThinking
          ? 'border-amber-400 bg-amber-400/10 shadow-amber-400/30'
          : 'border-slate-800 bg-slate-900 shadow-black'
      }`}>
        {isAiThinking ? (
          <Loader2 className="h-16 w-16 text-amber-400 animate-spin" />
        ) : (
          <BrainCircuit className={`h-20 w-20 ${isRecording ? 'text-rose-400' : 'text-slate-600'}`} />
        )}
      </div>

      {/* Mic Action Control */}
      <button
        onClick={toggleMicrophone}
        disabled={!isConnected || isAiThinking}
        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all cursor-pointer shadow-lg ${
          isRecording 
            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isAiThinking ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Analyzing Voice Response...
          </>
        ) : isRecording ? (
          <>
            <MicOff className="h-5 w-5" /> Stop & Submit Answer
          </>
        ) : (
          <>
            <Mic className="h-5 w-5" /> Start Live Audio
          </>
        )}
      </button>

      {/* Live Transcript Stream */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Volume2 className="h-4 w-4 text-emerald-400" /> Live Conversation Transcript
        </h3>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl text-sm flex items-start gap-3 ${
                msg.sender === 'ai'
                  ? 'bg-slate-950 border border-slate-800 text-slate-200'
                  : 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-300 ml-8'
              }`}
            >
              {msg.sender === 'ai' ? (
                <Bot className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <UserCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{msg.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}