import { useState, useRef } from 'react';
import { api } from '../services/api';
import { 
  Stethoscope, Camera, Upload, RefreshCw, AlertTriangle, 
  CheckCircle2, ShieldAlert, Sparkles, Loader2, X, Leaf, Bug, Sprout 
} from 'lucide-react';
import Card from '../components/ui/Card';

export default function CropDoctor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  // Live Camera State & Refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // 1. Handle File Upload from Device
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, WEBP).');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setDiagnosis(null);
      setError(null);
    }
  };

  // 2. Start Live Camera
  const startCamera = async () => {
    setError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera Access Error:', err);
      setError('Unable to access device camera. Please grant camera permissions or upload an image file instead.');
      setIsCameraActive(false);
    }
  };

  // 3. Capture Snapshot from Live Camera Stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `crop-snapshot-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setSelectedImage(file);
          setImagePreview(URL.createObjectURL(file));
          stopCamera();
          setDiagnosis(null);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  // 4. Stop Camera Stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // 5. Reset Selection
  const handleReset = () => {
    stopCamera();
    setSelectedImage(null);
    setImagePreview(null);
    setDiagnosis(null);
    setError(null);
  };

  // 6. Submit Image for AI Diagnosis (Updated to use api.js wrapper)
  const handleDiagnose = async () => {
    if (!selectedImage) {
      setError('Please select or capture a crop leaf photo first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.diagnoseCrop(selectedImage);
      setDiagnosis(response.diagnosis || response);
    } catch (err) {
      setError(err.message || 'Error processing crop image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-emerald-400" />
          AI Crop Doctor & Disease Diagnostics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Snap a live photo or upload an image of an infected leaf for instant AI treatment recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Capture & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-800 bg-slate-900/80 p-6 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden">
            
            {/* Live Camera Viewfinder */}
            {isCameraActive ? (
              <div className="w-full h-full flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-700 mb-4">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    onClick={stopCamera}
                    className="absolute top-2 right-2 bg-slate-950/80 hover:bg-slate-950 text-white p-1.5 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={capturePhoto}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Camera className="h-5 w-5" /> Capture Snapshot
                </button>
              </div>
            ) : imagePreview ? (
              /* Image Preview Area */
              <div className="w-full flex flex-col items-center">
                <div className="relative w-full aspect-square max-h-[280px] rounded-xl overflow-hidden border border-emerald-500/30 mb-4 bg-slate-950">
                  <img src={imagePreview} alt="Selected Crop" className="w-full h-full object-contain" />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-slate-950/80 hover:bg-slate-950 text-rose-400 p-1.5 rounded-full"
                    title="Remove Photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Retake / Clear
                  </button>
                </div>
              </div>
            ) : (
              /* Action Options: Camera or Upload */
              <div className="flex flex-col items-center justify-center text-center p-4 w-full">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                  <Leaf className="h-10 w-10 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Select Crop Image</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-xs">
                  Take a photo directly from your camera or upload an existing leaf picture from your gallery.
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={startCamera}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-3 rounded-xl text-xs transition-colors flex flex-col items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10"
                  >
                    <Camera className="h-5 w-5" /> Take Photo
                  </button>

                  <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-3 px-3 rounded-xl text-xs transition-colors flex flex-col items-center gap-2 cursor-pointer text-center">
                    <Upload className="h-5 w-5 text-emerald-400" /> Upload File
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* Hidden canvas element for drawing snapshot */}
            <canvas ref={canvasRef} className="hidden" />
          </Card>

          {/* Submit Action Button */}
          {selectedImage && !isCameraActive && (
            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Analyzing Crop Tissue...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Run AI Diagnosis
                </>
              )}
            </button>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Diagnosis Results */}
        <div className="lg:col-span-7">
          {loading ? (
            <Card className="border-slate-800 bg-slate-900/50 p-12 flex flex-col items-center justify-center text-center min-h-[420px]">
              <Loader2 className="h-10 w-10 text-emerald-400 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Inspecting Plant Pathology</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Gemini Vision AI is identifying crop species, visual lesions, pathogens, and curative treatments...
              </p>
            </Card>
          ) : diagnosis ? (
            <Card className="border-emerald-900/30 bg-slate-900/80 p-6 space-y-6">
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-1">
                    {diagnosis.cropName || 'Crop Leaf'}
                  </span>
                  <h2 className="text-xl font-extrabold text-white">{diagnosis.diseaseName}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    diagnosis.healthStatus?.toLowerCase().includes('healthy') 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {diagnosis.healthStatus}
                  </span>
                  {diagnosis.severity && diagnosis.severity !== 'N/A' && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Severity: {diagnosis.severity}
                    </span>
                  )}
                </div>
              </div>

              {/* Observed Symptoms */}
              {diagnosis.symptoms?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Bug className="h-4 w-4 text-amber-400" /> Visual Symptoms
                  </h4>
                  <ul className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    {diagnosis.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Treatments */}
              {diagnosis.treatment?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Curative Treatments
                  </h4>
                  <ul className="space-y-2">
                    {diagnosis.treatment.map((step, idx) => (
                      <li key={idx} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organic Remedies */}
              {diagnosis.organicRemedies?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sprout className="h-4 w-4 text-emerald-400" /> Natural & Organic Remedies
                  </h4>
                  <ul className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    {diagnosis.organicRemedies.map((remedy, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">🌱</span>
                        <span>{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ) : (
            <Card className="border-slate-800 bg-slate-900/30 p-12 flex flex-col items-center justify-center text-center min-h-[420px] text-slate-500">
              <ShieldAlert className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-300 mb-1">Awaiting Leaf Upload</h3>
              <p className="text-xs max-w-xs">
                Capture a photo using your camera or upload an image file on the left to display the AI diagnostic report.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}