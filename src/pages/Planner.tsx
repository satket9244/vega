import { useState } from "react";
import { Users, Sparkles, RefreshCw, ChevronRight, Check, X, Clock, Flame, Plus, Lock, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MealPlan } from "../types";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Planner() {
  const { profile, incrementPlannerCount } = useAuth();
  const [people, setPeople] = useState(2);
  const [dietary, setDietary] = useState<string[]>(["Vegán"]);
  const [avoid, setAvoid] = useState<string[]>(["Gomba"]);
  const [avoidInput, setAvoidInput] = useState("");
  const [portability, setPortability] = useState(false);
  const [desserts, setDesserts] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const generatePlan = async () => {
    if (!profile) return;
    
    // Limits check
    if (profile.plannerUseCount >= 3 && !profile.isSubscribed && !profile.isAdmin) {
      setShowPaywall(true);
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people, dietary, avoid, portability, desserts })
      });
      const data = await res.json();
      setPlan(data);
      // Increment only if not admin
      if (!profile.isAdmin) {
        await incrementPlannerCount();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDietary = (pref: string) => {
    setDietary(prev => prev.includes(pref) ? prev.filter(p => p !== p) : [...prev, pref]);
  };

  return (
    <div className="px-5 pt-10 pb-32 space-y-12 max-w-6xl mx-auto">
      <header className="flex justify-between items-end border-b border-green-100 pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-green-900 tracking-tight">Heti Étkezési Terv</h2>
          <p className="text-sm font-bold text-green-600/70 uppercase tracking-widest">Személyre szabott AI generálás</p>
        </div>
        <div className="bg-green-100 text-primary px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
          1. Lépés
        </div>
      </header>

      <section className="glass-card p-10 space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* People */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-green-600 uppercase tracking-[0.25em]">Személyek száma</label>
            <div className="flex items-center gap-6 bg-white/50 backdrop-blur rounded-[24px] w-fit p-2 border border-green-100 shadow-inner">
              <button onClick={() => setPeople(p => Math.max(1, p - 1))} className="w-12 h-12 rounded-xl bg-white border border-green-100 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all transform active:scale-90">
                <X size={20} className="rotate-45" />
              </button>
              <span className="text-3xl font-black text-primary w-8 text-center">{people}</span>
              <button onClick={() => setPeople(p => p + 1)} className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Dietary */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-green-600 uppercase tracking-[0.25em]">Étrend</label>
            <div className="flex flex-wrap gap-4">
              {["Vegán", "Gluténmentes", "Laktózmentes"].map(pref => (
                <button
                  key={pref}
                  onClick={() => toggleDietary(pref)}
                  className={`px-8 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95 ${
                    dietary.includes(pref)
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "border-green-100 bg-white/50 text-green-700/60 hover:border-green-200"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Avoid */}
        <div className="space-y-4 relative z-10">
          <label className="text-[10px] font-black text-green-600 uppercase tracking-[0.25em]">Tiltólista</label>
          <div className="flex flex-wrap items-center gap-3 p-5 bg-white/50 backdrop-blur rounded-[24px] border border-green-100 shadow-inner focus-within:ring-4 ring-primary/10 transition-all">
            {avoid.map(item => (
              <motion.span 
                layout
                key={item} 
                className="px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/10"
              >
                {item}
                <X size={14} className="cursor-pointer hover:rotate-90 transition-transform" onClick={() => setAvoid(avoid.filter(a => a !== item))} />
              </motion.span>
            ))}
            <input 
              className="bg-transparent border-none focus:ring-0 p-0 text-sm font-bold text-green-900 flex-grow min-w-[200px] placeholder:text-green-800/20"
              placeholder="Kerülendő összetevő hozzáadása..."
              value={avoidInput}
              onChange={(e) => setAvoidInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && avoidInput.trim()) {
                  setAvoid([...avoid, avoidInput.trim()]);
                  setAvoidInput("");
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-green-100 relative z-10">
          <div className="flex items-center justify-between group cursor-pointer" onClick={() => setPortability(!portability)}>
            <div className="space-y-1">
              <span className="font-black text-green-900 text-lg">Szállíthatóság</span>
              <p className="text-xs font-bold text-green-600/60 uppercase tracking-tight">Csomagolható ebédekre optimalizálva</p>
            </div>
            <div className={`w-16 h-9 rounded-2xl relative transition-all duration-500 shadow-inner ${portability ? "bg-primary" : "bg-green-100"}`}>
              <motion.div 
                animate={{ x: portability ? 32 : 4 }}
                className="w-7 h-7 bg-white rounded-xl absolute top-1 shadow-md" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between group cursor-pointer" onClick={() => setDesserts(!desserts)}>
            <div className="space-y-1">
              <span className="font-black text-green-900 text-lg">Desszert</span>
              <p className="text-xs font-bold text-green-600/60 uppercase tracking-tight">Kényeztetés minden napra</p>
            </div>
            <div className={`w-10 h-10 rounded-2xl border-4 flex items-center justify-center transition-all ${desserts ? "bg-primary border-primary shadow-lg shadow-primary/20 scale-110" : "border-green-100 bg-white"}`}>
              {desserts && <Check size={24} className="text-white font-black" strokeWidth={4} />}
            </div>
          </div>
        </div>

        <button 
          onClick={generatePlan}
          disabled={isGenerating}
          className="w-full py-6 btn-primary !rounded-[24px] text-xl font-black shadow-[0_20px_50px_rgba(22,101,52,0.2)] disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={28} />}
          {isGenerating ? "Terv generálása folyamatban..." : "Étrend generálása"}
        </button>
      </section>

      {/* Plan Results */}
      {plan && (
        <section className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h2 className="text-3xl font-black text-green-900 border-b-4 border-green-100 pb-4 inline-block">Személyes Étrended</h2>
          <div className="space-y-16">
            {plan.days.map((day, idx) => (
              <div key={idx} className="relative pl-8 md:pl-40 group">
                {/* Timeline bit */}
                <div className="absolute left-0 md:left-32 top-0 bottom-0 w-1 bg-green-100 group-last:bottom-[70%]" />
                <div className="absolute left-[-10px] md:left-[118px] top-6 w-[28px] h-[28px] rounded-xl bg-white border-4 border-primary shadow-xl z-10" />
                
                <div className="md:absolute md:left-0 md:top-4 md:text-right md:w-28 space-y-1">
                  <h3 className="text-2xl font-black text-primary leading-tight">{day.day}</h3>
                  <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.25em]">{idx + 1}. NAP</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Object.entries(day.meals).map(([type, meal]) => meal && (
                    <motion.div 
                      key={type} 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="glass-card overflow-hidden flex flex-col h-full group/card"
                    >
                      <div className="relative h-40 bg-green-50 overflow-hidden flex items-center justify-center">
                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 z-10">
                          {type === 'breakfast' ? 'Reggeli' : type === 'lunch' ? 'Ebéd' : type === 'dinner' ? 'Vacsora' : 'Desszert'}
                        </div>
                        <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-primary shadow-xl hover:bg-primary hover:text-white transition-all transform active:scale-90 z-10">
                          <RefreshCw size={18} />
                        </button>
                        <div className="text-primary/10 font-black uppercase tracking-[0.3em] text-2xl select-none">
                          {type === 'breakfast' ? 'Reggeli' : type === 'lunch' ? 'Ebéd' : type === 'dinner' ? 'Vacsora' : 'Desszert'}
                        </div>
                      </div>
                      <div className="p-6 space-y-4 flex-1 flex flex-col">
                        <h4 className="text-lg font-black leading-tight text-green-900 group-hover/card:text-primary transition-colors flex-1">{meal.name}</h4>
                        <div className="flex items-center gap-5 text-[10px] font-black text-green-700/50 uppercase tracking-[0.1em] border-t border-green-50 pt-4">
                          <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> {meal.time}p</span>
                          <span className="flex items-center gap-1.5 text-orange-500/70"><Flame size={16} /> {meal.calories} kcal</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-green-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <button 
                onClick={() => setShowPaywall(false)}
                className="absolute top-6 right-6 p-2 text-green-300 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-8 text-center relative z-10">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center">
                  <Lock size={40} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-green-900 tracking-tight">Limit Elérve</h3>
                  <p className="text-green-600 font-bold">Az ingyenes 3 alkalmas tervezésed elfogyott. Folytasd a Pro verzióval!</p>
                </div>

                <div className="bg-green-50 rounded-[32px] p-8 space-y-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-black uppercase text-xs tracking-widest">Havi Előfizetés</span>
                    <span className="text-2xl font-black text-primary italic">1.490 Ft / hó</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {["Végtelen étrend generálás", "AI hűtő felismerés extra tippekkel", "Minden új funkció elsőbbségi elérése"].map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-bold text-green-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  to="/profile"
                  className="w-full h-16 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <CreditCard size={24} />
                  ELŐFIZETÉS MOST
                </Link>
                <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Bármikor lemondható az áruházban</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
