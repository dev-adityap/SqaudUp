import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

// Every key this app has ever written. Cleared on sign-out so a shared device
// cannot leak a previous account's joined games or cached profile.
const CLIENT_STORAGE_KEYS = [
  'joinedGames',
  'joined_guest',
  'notifications',
];

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

  // Link the Firebase identity to a Mongo user, then clear on sign-out.
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
        const data = await apiFetch('/api/auth/sync', { method: 'POST' });
        setProfile(data.data);
      } catch (err) {
        // Non-fatal: browsing still works, but mutations will report the error.
        console.error('Profile sync failed:', err.message);
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
      // onAuthStateChanged fires and clears state + storage; force it for safety.
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
