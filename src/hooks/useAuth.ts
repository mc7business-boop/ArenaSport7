/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../lib/firebase.ts';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserProfile } from '../types.ts';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, profile, loading, login, logout };
};
