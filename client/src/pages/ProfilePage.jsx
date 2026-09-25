import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Settings, Award } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth'); // Redirect to login screen after logging out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="bg-[#0f0f13] border border-neutral-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 mb-8">
        
        {/* Dynamic Google Profile Picture */}
        <img 
          src={currentUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"} 
          alt="Profile" 
          referrerPolicy="no-referrer" /* ADD THIS LINE */
          className="w-32 h-32 rounded-full border-4 border-neutral-800 object-cover shrink-0"
        />
        
        <div className="text-center md:text-left flex-1">
          {/* Dynamic Google Display Name */}
          <h1 className="text-4xl font-display font-black text-white uppercase mb-2">
            {currentUser?.displayName || "SQUADUP ATHLETE"}
          </h1>
          <p className="text-[#ff5500] font-bold flex items-center justify-center md:justify-start gap-2 mb-2">
            <Award className="w-5 h-5" /> 98% Reliability Rating
          </p>
          {/* Dynamic Google Email */}
          <p className="text-neutral-400 text-sm">
            {currentUser?.email}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
          <Settings className="w-5 h-5" /> Edit Profile
        </button>
        
        {/* Sign Out / Switch Account Button */}
        <button 
          onClick={handleSignOut}
          className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
}