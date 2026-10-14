import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Activity } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLang } from '../../context/LangContext';

export default function AudioRecorder() {
  const { isRecording, startRecording, stopRecording, socketStatus } = useVoice();
  const { t } = useLang();
  const [visualizerData, setVisualizerData] = useState(new Array(20).fill(10));
  const animationRef = useRef(null);

  // Simulating an audio visualizer for the UI
  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        setVisualizerData(Array.from({ length: 20 }, () => Math.floor(Math.random() * 40) + 10));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
      setVisualizerData(new Array(20).fill(10));
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800">
      <div className="flex items-end justify-center h-16 gap-1 mb-6 w-full">
        {visualizerData.map((height, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-t-full transition-all duration-75 ${
              isRecording ? 'bg-emerald-400' : 'bg-slate-700'
            }`}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={socketStatus === 'connecting'}
        className={`relative flex items-center justify-center h-16 w-16 rounded-full transition-all shadow-xl ${
          isRecording 
            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-900/50' 
            : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isRecording ? <Square className="h-6 w-6 text-white fill-white" /> : <Mic className="h-6 w-6 text-white" />}
        
        {/* Radar Ping Effect */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-75" />
        )}
      </button>

      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
        {socketStatus === 'connecting' ? 'Connecting...' : isRecording ? 'Listening...' : 'Tap to Speak'}
      </p>
    </div>
  );
}