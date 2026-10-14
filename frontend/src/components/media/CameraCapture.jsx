import { useRef, useState, useCallback } from 'react';
import { Camera, X, Check, RefreshCw } from 'lucide-react';
import { useLang } from '../../context/LangContext';

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [imageCaptured, setImageCaptured] = useState(null);
  const { t } = useLang();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Defaults to rear camera on mobile
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setImageCaptured(imageDataUrl);
      stopCamera();
    }
  };

  const confirmPhoto = () => {
    if (imageCaptured && onCapture) {
      // Convert Data URL to Blob/File for the backend
      fetch(imageCaptured)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "crop_scan.jpg", { type: "image/jpeg" });
          onCapture(file, imageCaptured);
        });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-80 bg-slate-950 rounded-2xl overflow-hidden border border-slate-700">
      {!imageCaptured ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button onClick={onCancel} className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700">
              <X className="h-6 w-6" />
            </button>
            <button onClick={capturePhoto} className="p-4 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg border-2 border-white">
              <Camera className="h-6 w-6" />
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={imageCaptured} alt="Captured Crop" className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button onClick={() => { setImageCaptured(null); startCamera(); }} className="p-3 rounded-full bg-slate-800 text-white hover:bg-slate-700">
              <RefreshCw className="h-6 w-6" />
            </button>
            <button onClick={confirmPhoto} className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg flex items-center gap-2">
              <Check className="h-5 w-5" /> Use Photo
            </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}