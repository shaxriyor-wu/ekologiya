import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle2, Scan, ShieldAlert, XCircle, FlipHorizontal } from 'lucide-react';
import { analyzeWasteImage } from '../services/geminiService';
import { AuthService } from '../services/authService';
import { WasteAnalysisResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { useNavigate } from 'react-router-dom';

interface ScannerProps {
  lang: Language;
}

export const Scanner: React.FC<ScannerProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].scanner;
  const navigate = useNavigate();
  
  // State
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Device & Camera State
  const [isMobile, setIsMobile] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // 'user' = front, 'environment' = back
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. Detect Device on Mount
  useEffect(() => {
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    setIsMobile(mobileCheck);
  }, []);

  // 2. Start Camera (Mobile va Desktop - Real Camera)
  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      // Stop previous stream if exists
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Desktop va Mobile uchun real camera
      const constraints: MediaStreamConstraints = isMobile 
        ? { video: { facingMode: facingMode } } // Mobile: front or rear camera
        : { video: true }; // Desktop: default camera (real camera)
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("Kameraga ruxsat bering!");
    }
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Capture Photo from Video Stream (Real Camera)
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Real camera'dan rasm olish
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg');
        setImage(base64);
        processImage(base64);
      }
    }
  };

  // Handle Desktop File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Super Filter Logic & Processing
  const processImage = async (base64: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // ANTI-FRAUD: Check Time Interval (Spam check)
    const lastScanTime = localStorage.getItem('last_scan_time');
    const now = Date.now();
    if (lastScanTime && (now - parseInt(lastScanTime)) < 120000) { // 2 minutes
      setLoading(false);
      setError("Diqqat! Firibgarlikni oldini olish uchun har bir skan orasida 2 daqiqa kuting.");
      setImage(null);
      return;
    }

    try {
      const analysis = await analyzeWasteImage(base64);
      
      // ANTI-FRAUD: Authenticity Check
      if (!analysis.isAuthentic) {
        throw new Error(analysis.rejectionReason || "Rasm haqiqiy emas! Ekranda olingan yoki AI rasm qabul qilinmaydi.");
      }

      setResult(analysis);
      
      // Save scan time for fraud check
      localStorage.setItem('last_scan_time', now.toString());

    } catch (err: any) {
      setError(err.message || "Tahlil xatosi.");
      setImage(null); // Reset to force new photo
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (result && result.isAuthentic) {
      const user = await AuthService.getCurrentUser();
      if (user) {
        await AuthService.updateStats(user.id, result.ecoValue, result.weightEstimateKg);
        navigate('/dashboard');
      }
    }
  };

  // Initialize Camera flow (Mobile va Desktop - Real Camera)
  useEffect(() => {
    if (!image) {
      // Desktop va Mobile uchun real camera ochish
      startCamera();
    }
    return () => {
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [image, facingMode, isMobile]);

  const triggerDesktopInput = () => fileInputRef.current?.click();

  return (
    <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4 max-w-2xl mx-auto min-h-screen flex flex-col items-center">
      <div className="text-center mb-4 sm:mb-6 w-full">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
           <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border ${isMobile ? 'bg-eco-500/10 border-eco-500 text-eco-500' : 'bg-blue-500/10 border-blue-500 text-blue-500'}`}>
             {isMobile ? "Mobil Rejim (Real Camera)" : "Kompyuter Rejimi (Real Camera)"}
           </div>
        </div>
      </div>

      <div className="w-full glass-card rounded-2xl sm:rounded-3xl p-1 shadow-2xl relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex flex-col">
        {/* HUD Corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-eco-500/50 rounded-tl-lg z-20"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-eco-500/50 rounded-tr-lg z-20"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-eco-500/50 rounded-bl-lg z-20"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-eco-500/50 rounded-br-lg z-20"></div>

        {error && (
          <div className="absolute top-10 left-4 right-4 z-30 bg-red-500/90 text-white p-4 rounded-xl flex items-center gap-3 backdrop-blur-md animate-bounce">
            <ShieldAlert size={24} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* --- DESKTOP VIEW (REAL CAMERA) --- */}
        {!isMobile && !image && (
          <div className="flex-1 relative bg-black flex flex-col">
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover"
             />
             <canvas ref={canvasRef} className="hidden" />
             
             {/* Camera Trigger */}
             <div className="absolute bottom-8 left-0 w-full flex justify-center z-30">
                <button 
                  onClick={capturePhoto}
                  className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 bg-white/20 backdrop-blur-sm hover:scale-105"
                >
                  <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>
             </div>
          </div>
        )}

        {/* --- MOBILE VIEW (CAMERA) --- */}
        {isMobile && !image && (
          <div className="flex-1 relative bg-black flex flex-col">
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover"
             />
             <canvas ref={canvasRef} className="hidden" />
             
             {/* Camera Switch Button */}
             <div className="absolute top-4 right-4 z-30">
                <button 
                  onClick={switchCamera}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center transition-transform active:scale-95 hover:scale-105"
                  title={facingMode === 'environment' ? "Old kameraga o'tish" : "Orqa kameraga o'tish"}
                >
                  <FlipHorizontal className="text-white" size={24} />
                </button>
             </div>
             
             {/* Camera Trigger */}
             <div className="absolute bottom-4 sm:bottom-8 left-0 w-full flex justify-center z-30">
                <button 
                  onClick={capturePhoto}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 bg-white/20 backdrop-blur-sm hover:scale-105"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
                </button>
             </div>
          </div>
        )}

        {/* --- RESULT / PREVIEW VIEW --- */}
        {image && (
          <div className="relative flex-1 bg-black flex items-center justify-center">
            <img src={image} alt="Captured" className="max-h-full max-w-full object-contain" />
            
            {loading && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-eco-500/30 border-t-eco-500 rounded-full animate-spin"></div>
                  <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-eco-400" size={32} />
                </div>
                <p className="text-eco-400 font-mono mt-6 animate-pulse font-bold text-lg">SUPER FILTER: Checking Fraud...</p>
                <p className="text-slate-500 text-xs mt-2">AI Authenticity Check</p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Result Panel */}
        {result && (
          <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 animate-[slideUp_0.3s]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                   {result.material}
                   {result.isAuthentic && result.isRecyclable && <CheckCircle2 size={18} className="text-blue-500" />}
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${result.isRecyclable ? 'bg-eco-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {result.isRecyclable ? "Qayta ishlanadi" : "Qabul qilinmaydi"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Hisoblangan Qiymat</p>
                <p className={`text-2xl font-display font-bold ${result.ecoValue > 0 ? 'text-eco-500' : 'text-slate-600'}`}>
                  {result.ecoValue > 0 ? `+${result.ecoValue}` : '0'} UZS
                </p>
              </div>
            </div>
            
            <p className={`text-sm mb-6 p-3 rounded-lg border italic ${result.isRecyclable ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300'}`}>
              "{result.explanation}"
            </p>

            {result.isRecyclable ? (
               <button 
                 onClick={handleClaim}
                 className="w-full bg-eco-500 hover:bg-eco-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-eco-500/25 flex items-center justify-center gap-2"
               >
                 <CheckCircle2 size={20} /> Tangalarni Olish
               </button>
            ) : (
               <button 
                 onClick={() => setImage(null)}
                 className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
               >
                 <XCircle size={20} /> Boshqa narsa skan qilish
               </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};