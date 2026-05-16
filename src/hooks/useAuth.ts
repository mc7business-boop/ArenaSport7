/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../lib/firebase.ts';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types.ts';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on mount
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect login error:", error);
      toast.error("Erro ao entrar com Google. Tente novamente.");
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Sync profile
        const userDoc = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userDoc);
        
        if (!snap.exists()) {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Colecionador',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            createdAt: serverTimestamp(),
            level: 1,
            xp: 0,
            isPremium: false,
            badges: [],
            totalOwned: 0,
            totalRepeated: 0,
          };
          await setDoc(userDoc, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(snap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      // Check if mobile (more strict popup blocking)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-blocked') {
        toast.error("O bloqueador de popups impediu o login. Tentando redirecionar...");
        await signInWithRedirect(auth, googleProvider);
      } else {
        toast.error("Falha na autenticação. Verifique sua conexão.");
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, profile, loading, login, logout };
};
