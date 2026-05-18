import { useState, useRef } from "react";
import { Camera, Zap, Image as ImageIcon, Sparkles, Plus, History, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Vision() {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL("image/jpeg", 0.8);
    setCapturedImage(base64);
    setIsScanning(true);

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 })
      });
      const data = await res.json();
      setResults(data.ingredients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="px-5 pt-10 pb-40 space-y-12 max-w-6xl mx-auto">
      <header className="space-y-2 border-b border-green-100 pb-6">
        <h2 className="text-4xl font-black text-green-900 tracking-tight">AI Fridge Vision</h2>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-green-500/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">Aktív elemzés</div>
          <p className="text-sm font-bold text-green-600/70">Készíts fotót a hűtődről, és az AI receptet javasol!</p>
        </div>
      </header>

      {/* Viewfinder */}
      <section className="relative aspect-[4/5] md:aspect-[16/9] bg-black rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] group border-[10px] border-white ring-1 ring-green-100">
        {!capturedImage ? (
          <video 
            ref={videoRef} 
            onLoadedMetadata={startCamera} 
            className="w-full h-full object-cover opacity-90"
            autoPlay 
            playsInline 
          />
        ) : (
          <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
        )}

        {/* Scan line effect */}
        {isScanning && <div className="scan-line" />}
        
        {/* Detection feedback overlay - Simulated dots */}
        {!isScanning && capturedImage && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full border-4 border-white bg-primary/80 shadow-2xl backdrop-blur-md" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full border-4 border-white bg-orange-500/80 shadow-2xl backdrop-blur-md" />
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-12 z-20">
          <button className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
            <Zap size={28} />
          </button>
          
          <button 
            onClick={captureAndAnalyze}
            disabled={isScanning}
            className="w-24 h-24 rounded-full bg-white p-1.5 shadow-[0_0_50px_rgba(255,255,255,0.5)] active:scale-95 transition-all disabled:opacity-50 group/btn"
          >
            <div className="w-full h-full rounded-full border-8 border-primary bg-primary flex items-center justify-center text-white shadow-inner group-hover/btn:bg-green-700 transition-colors">
              {isScanning ? <RefreshCw className="animate-spin" size={32} /> : <Camera size={40} strokeWidth={2.5} />}
            </div>
          </button>

          <button className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-2xl text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
            <ImageIcon size={28} />
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </section>

      {/* Detection Results */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-green-100 pb-4">
          <h3 className="text-2xl font-black text-green-900">Feltérképezett alapanyagok</h3>
          <button className="text-[10px] font-black text-primary tracking-[0.2em] uppercase flex items-center gap-2 hover:bg-green-50 px-4 py-2 rounded-xl transition-all border border-green-100 bg-white">
            <Edit3 size={16} /> Szerkesztés
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((ing, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 flex items-center gap-5 group hover:-translate-y-2 transition-all cursor-pointer bg-white/80"
                >
                  <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">{ing.category}</p>
                    <p className="text-lg font-black text-green-900 truncate w-32">{ing.name}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-card border-4 border-dashed border-green-100 bg-green-50/20">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                  <Camera size={40} />
                </div>
                <p className="text-lg font-bold text-green-800/40 px-10">Kattints a gombra a hűtő elemzéséhez!</p>
              </div>
            )}
          </AnimatePresence>
          
          <button className="p-6 rounded-[24px] border-4 border-dashed border-green-200 bg-white/50 flex items-center justify-center gap-4 hover:bg-white hover:border-primary/30 transition-all font-black text-primary text-sm uppercase tracking-widest shadow-inner">
            <Plus size={24} strokeWidth={3} />
            Hozzáadás
          </button>
        </div>
      </section>

      {/* Primary Action */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={results.length === 0}
        className="w-full py-6 btn-primary !rounded-[28px] text-xl font-black shadow-[0_20px_50px_rgba(22,101,52,0.25)] flex items-center justify-center gap-4 disabled:opacity-50 disabled:shadow-none"
      >
        <Sparkles size={32} />
        Receptek generálása
      </motion.button>

      {/* History */}
      <section className="space-y-10 pt-10">
        <h3 className="text-2xl font-black text-green-900 flex items-center gap-4">
          <History size={28} className="text-primary" /> Korábbi elemzések
          <div className="flex-1 h-px bg-green-100" />
        </h3>
        <div className="flex gap-8 overflow-x-auto pb-10 -mx-5 px-5 hide-scrollbar">
          {[
            { label: "Kamra Alapok", time: "2 órája", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop" },
            { label: "Nyári Saláta", time: "Tegnap", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop" },
            { label: "Gyökérzöldségek", time: "2 napja", img: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&h=300&fit=crop" },
          ].map((scan, i) => (
            <div key={i} className="shrink-0 w-64 space-y-4 group cursor-pointer">
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white group-hover:scale-[1.02] transition-all duration-500 relative">
                <img src={scan.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={scan.label} />
                <div className="absolute inset-0 bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white">
                    <History size={32} />
                  </div>
                </div>
              </div>
              <div className="pl-4 border-l-4 border-green-100">
                <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em] mb-1">{scan.time}</p>
                <p className="text-lg font-black text-green-900 group-hover:text-primary transition-colors">{scan.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
