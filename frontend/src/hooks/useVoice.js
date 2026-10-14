import { useState, useEffect, useRef, useCallback } from 'react';
import { wsClient } from '../services/websocket';

export function useVoice() {
  const [isRecording, setIsRecording] = useState(false);
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const mediaRecorder = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const handleStatus = (status) => setSocketStatus(status);
    wsClient.onStatusChange(handleStatus);
    
    return () => {
      wsClient.disconnect();
      stopRecording();
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (socketStatus !== 'connected') {
        wsClient.connect();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Capturing raw audio chunks[cite: 1]
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && wsClient.isConnected()) {
          wsClient.sendAudioChunk(event.data);
        }
      };

      mediaRecorder.current.start(250); // Capture chunk every 250ms
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      setIsRecording(false);
    }
  }, [socketStatus]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    socketStatus,
    startRecording,
    stopRecording
  };
}