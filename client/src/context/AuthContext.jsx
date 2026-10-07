import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut as fbSignOut, setPersistence, browserLocalPersistence } from 'firebase/auth';

const AuthContext = createContext(null);

const CLIENT_STORAGE_KEYS = ['joinedGames', 'joined_guest', 'notifications'];

const clearClientStorage = () => {
  CLIENT_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
  Object.keys(localStorage)
    .filter((k) => k.startsWith('joined_'))
    .forEach((k) => localStorage.removeItem(k));
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) =>
      console.error('Auth persistence setup failed:', err)
    );
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setProfile(null);
        clearClientStorage();
        setLoading(false);
        return;
      }
      try {
        setSyncing(true);
        const freshToken = await user.getIdToken(true);

        // FIX: Native fetch bypasses your apiFetch utility to guarantee the payload shape
        const response = await fetch('http://localhost:5000/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${freshToken}`
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'SquadUp Athlete',
            picture: user.photoURL || ''
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        setProfile(data.data || data);

      } catch (err) {
        console.error('SYNC FAILED:', err.message);
      } finally {
        setSyncing(false);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fbSignOut(auth);
      setCurrentUser(null);
      setProfile(null);
      clearClientStorage();
      return true;
    } catch (err) {
      console.error('Sign out failed:', err.message);
      return false;
    }
  }, []);

  const value = useMemo(() => ({
    currentUser,
    profile,
    loading,
    syncing,
    signOut,
    isAuthenticated: !!currentUser,
  }), [currentUser, profile, loading, syncing, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};