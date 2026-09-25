// client/src/pages/AuthPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../config/firebase';

export default function AuthPage() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Optional: Later, we can send result.user data to MongoDB here to create a profile
      navigate('/explore');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#0f0f13] border border-neutral-800 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-[#ff5500] rounded mx-auto flex items-center justify-center font-display font-black text-white text-2xl mb-6">
          S
        </div>
        <h1 className="text-3xl font-display font-black text-white mb-2">JOIN SQUADUP.</h1>
        <p className="text-neutral-400 text-sm mb-8">Sign in to find games, host spaces, and connect with local athletes.</p>
        
        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-200 text-black font-bold py-3.5 px-4 rounded-xl transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}