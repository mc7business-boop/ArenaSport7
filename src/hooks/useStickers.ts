/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sticker, UserSticker } from '../types.ts';
import { generateInitialAlbum, TOTAL_STICKERS_COUNT } from '../constants.ts';
import { db, auth } from '../lib/firebase.ts';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export const useStickers = (userId?: string) => {
  const [stickers, setStickers] = useState<Sticker[]>(generateInitialAlbum());
  const [loading, setLoading] = useState(true);

  // Sync with Firestore
  useEffect(() => {
    if (!userId) {
      // Local storage fallback for guests
      const saved = localStorage.getItem('copa_stickers_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setStickers(prev => prev.map(s => {
            const found = parsed.find((p: any) => p.id === s.id);
            return found ? { ...s, owned: found.owned, quantity: found.quantity } : s;
          }));
        } catch (e) {
          console.error("Local storage error:", e);
        }
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const collectionRef = collection(db, 'users', userId, 'collection');
    
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const serverData = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data() as UserSticker;
        return acc;
      }, {} as Record<string, UserSticker>);

      setStickers(prev => prev.map(s => {
        const data = serverData[s.id];
        return {
          ...s,
          owned: !!data && data.quantity > 0,
          quantity: data ? data.quantity : 0
        };
      }));
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      toast.error("Erro ao sincronizar álbum.");
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  // Persistent updates
  const updateSticker = useCallback(async (id: string, quantity: number) => {
    const isOwned = quantity > 0;
    
    // Update local state immediately for snappy UX
    setStickers(prev => prev.map(s => s.id === id ? { ...s, owned: isOwned, quantity } : s));

    if (userId) {
      const docRef = doc(db, 'users', userId, 'collection', id);
      try {
        if (quantity === 0) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            stickerId: id,
            quantity: quantity,
            updatedAt: serverTimestamp()
          });
        }
      } catch (error) {
        console.error("Firestore update error:", error);
        toast.error("Erro ao salvar no servidor.");
      }
    } else {
      // Save local storage
      const current = stickers.map(s => s.id === id ? { ...s, owned: isOwned, quantity } : s);
      localStorage.setItem('copa_stickers_v2', JSON.stringify(current.filter(s => s.quantity > 0)));
    }
  }, [userId, stickers]);

  const toggleOwned = useCallback((id: string) => {
    const s = stickers.find(st => st.id === id);
    if (!s) return;
    updateSticker(id, s.owned ? 0 : 1);
  }, [stickers, updateSticker]);

  const addQuantity = useCallback((id: string, amount: number) => {
    const s = stickers.find(st => st.id === id);
    if (!s) return;
    const newQty = Math.max(0, s.quantity + amount);
    updateSticker(id, newQty);
  }, [stickers, updateSticker]);

  const batchAdd = useCallback(async (ids: string[]) => {
    if (userId) {
      const batch = writeBatch(db);
      ids.forEach(id => {
        const docRef = doc(db, 'users', userId, 'collection', id);
        batch.set(docRef, {
          stickerId: id,
          quantity: 1, // Defaulting to 1 for quick add
          updatedAt: serverTimestamp()
        });
      });
      await batch.commit();
      toast.success(`${ids.length} figurinhas sincronizadas!`);
    } else {
      setStickers(prev => {
        const next = prev.map(s => ids.includes(s.id) ? { ...s, owned: true, quantity: Math.max(s.quantity, 1) } : s);
        localStorage.setItem('copa_stickers_v2', JSON.stringify(next.filter(s => s.quantity > 0)));
        return next;
      });
      toast.success(`${ids.length} figurinhas adicionadas localmente.`);
    }
  }, [userId]);

  // Batch analysis for numbers/text
  const parseAndAdd = useCallback((input: string) => {
    const parts = input.split(/[,\s\n]+/).filter(Boolean);
    const idsToAdd: string[] = [];
    
    parts.forEach(p => {
      const normalized = p.toUpperCase();
      // Try to match BRA-10, ARG-1 etc
      const exists = stickers.some(s => s.id === normalized);
      if (exists) {
        idsToAdd.push(normalized);
      }
    });

    if (idsToAdd.length > 0) {
      batchAdd(idsToAdd);
    } else {
      toast.error("Nenhuma figurinha válida encontrada. Use o formato BRA-10.");
    }
  }, [stickers, batchAdd]);

  // Statistics
  const stats = useMemo(() => {
    const owned = stickers.filter(s => s.owned).length;
    const repeated = stickers.reduce((acc, s) => acc + Math.max(0, s.quantity - 1), 0);
    return {
      total: TOTAL_STICKERS_COUNT,
      owned,
      missing: TOTAL_STICKERS_COUNT - owned,
      repeated,
      percentage: Math.round((owned / TOTAL_STICKERS_COUNT) * 100) || 0
    };
  }, [stickers]);

  return {
    stickers,
    loading,
    toggleOwned,
    addQuantity,
    parseAndAdd,
    stats,
    batchAdd
  };
};
