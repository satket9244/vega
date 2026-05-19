import { User as UserIcon, Shield, CreditCard, LogOut, ExternalLink, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Profile() {
  const { user, profile, signOut } = useAuth();

  const toggleSubscription = async () => {
    if (!user || !profile) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      isSubscribed: !profile.isSubscribed
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-green-50 text-primary rounded-3xl flex items-center justify-center">
          <UserIcon size={40} />
        </div>
        <h2 className="text-3xl font-black text-green-900 italic">Bejelentkezés Szükséges</h2>
        <p className="text-green-600 font-bold">Kérlek jelentkezz be a profilod megtekintéséhez.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-10 pb-40 space-y-12 max-w-4xl mx-auto">
      <header className="space-y-6 text-center border-b border-green-100 pb-12">
        <div className="w-32 h-32 bg-primary/10 rounded-[40px] mx-auto flex items-center justify-center border-4 border-white shadow-2xl relative">
          {user.photoURL ? (
            <img src={user.photoURL} className="w-full h-full rounded-[36px] object-cover" alt="Avatar" />
          ) : (
            <UserIcon size={64} className="text-primary" />
          )}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-primary border border-green-50">
            {profile?.isAdmin ? <Shield size={20} /> : <UserIcon size={20} />}
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-green-900">{user.displayName || 'Felhasználó'}</h1>
          <p className="text-green-600 font-bold">{user.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subscription Status */}
        <section className="glass-card p-8 space-y-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16" />
          
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-green-900 italic">Előfizetés</h3>
            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${profile?.isSubscribed ? 'bg-primary text-white shadow-lg' : 'bg-green-100 text-green-600'}`}>
              {profile?.isSubscribed ? 'Aktív Pro' : 'Ingyenes'}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold text-green-800">
              <span>Heti Tervező használat:</span>
              <span className="text-primary">{profile?.plannerUseCount || 0} / 3</span>
            </div>
            <div className="w-full h-2 bg-green-50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((profile?.plannerUseCount || 0) / 3) * 100, 100)}%` }}
                className="h-full bg-primary"
              />
            </div>
            {profile?.plannerUseCount && profile.plannerUseCount >= 3 && !profile.isSubscribed && (
              <p className="text-[10px] font-black text-red-500 uppercase">Limit elérve! Válts Pro-ra a folytatáshoz.</p>
            )}
          </div>

          <button 
            onClick={toggleSubscription}
            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${profile?.isSubscribed ? 'bg-green-100 text-green-600 hover:bg-red-50 hover:text-red-500' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105'}`}
          >
            {profile?.isSubscribed ? 'Lemondás' : 'Előfizetés (MOCK)'}
          </button>
        </section>

        {/* Cancellation Info */}
        <section className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 text-green-900 italic font-black">
            <HelpCircle size={24} className="text-primary" />
            <h3>Lemondási Feltételek</h3>
          </div>
          
          <div className="space-y-4 text-xs font-medium text-green-700 leading-relaxed">
            <p>1. Az előfizetést bármikor lemondhatod a számlázási ciklus vége előtt.</p>
            <p>2. Google Play Áruházban: Nyisd meg a Play Áruházat → Profilkép → Fizetések és előfizetések → Előfizetések → ZöldReceptek lemondása.</p>
            <p>3. Apple App Store-ban: Beállítások → Apple ID → Előfizetések → ZöldReceptek → Lemondás.</p>
            <p>4. Lemondás után a Pro funkciókat az aktuális számlázási időszak végéig használhatod.</p>
          </div>

          <a 
            href="https://play.google.com/store/account/subscriptions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-all group"
          >
            <span className="text-xs font-black text-green-800 uppercase tracking-widest">Kezelés a Play Áruházban</span>
            <ExternalLink size={16} className="text-primary transition-transform group-hover:translate-x-1" />
          </a>
        </section>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <LogOut size={20} />
          KIJELENTKEZÉS
        </button>
      </div>
    </div>
  );
}
