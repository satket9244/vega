import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  plannerUseCount: number;
  isSubscribed: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  incrementPlannerCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        
        // Initial profile check
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          const newProfile = {
            uid: u.uid,
            email: u.email,
            plannerUseCount: 0,
            isSubscribed: false,
            isAdmin: u.email === 'ujfalusi.peter91@gmail.com' // Set initial admin
          };
          await setDoc(userRef, newProfile);
          
          // Seed admin collection if they are admin
          if (newProfile.isAdmin) {
            await setDoc(doc(db, 'admins', u.uid), { email: u.email });
          }
        }

        // Listen for changes
        const unsubProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        });

        setLoading(false);
        return unsubProfile;
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
  }, []);

  const incrementPlannerCount = async () => {
    if (!user || !profile) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...profile,
      plannerUseCount: profile.plannerUseCount + 1
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signIn: async () => {}, // Handled by App.tsx for now or specialized login
      signOut: () => auth.signOut(),
      incrementPlannerCount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
