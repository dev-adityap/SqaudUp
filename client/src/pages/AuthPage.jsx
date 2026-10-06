import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../config/firebase';
import { useToast } from '../context/ToastContext';
import { Logo } from '../components/Logo';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const handleGoogleSignIn = async () => {
    setBusy(true);
    try {
      await signInWithPopup(auth, provider);
      // Return the user to whatever they were trying to reach.
      navigate(location.state?.from || '/explore', { replace: true });
      toast.success('Welcome to SquadUp.');
    } catch (err) {
      // A user closing the popup is not an error worth alarming them about.
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Sign in failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-20">
      <div className="w-full max-w-md bg-[#0f0f13] border border-neutral-800 rounded-2xl p-8 text-center">
        <Logo size="md" showWord={false} className="justify-center mb-6" />
        <h1 className="text-3xl font-display font-black text-white mb-2">JOIN SQUADUP.</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Sign in to find games, host spaces, and connect with local athletes.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-200 disabled:opacity-60 text-black font-bold py-3.5 px-4 rounded-xl transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" aria-hidden="true" className="w-5 h-5" />
          {busy ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="text-[11px] text-neutral-600 mt-6">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
