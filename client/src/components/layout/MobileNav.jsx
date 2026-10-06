import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, User, Settings } from 'lucide-react';
import { Logo, LogoWord } from '../Logo';

export default function MobileNav({ isOpen, onClose, links }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#08080a] border-l border-neutral-800 z-50 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <Logo size="sm" showWord={false} />
                <LogoWord className="text-xl" />
                <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={`text-lg font-display tracking-wider py-2.5 px-3 rounded transition ${
                      location.pathname === link.path
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col gap-3">
                <Link to="/notifications" onClick={onClose} className="flex items-center gap-3 text-sm text-neutral-300 py-1">
                  <Bell className="w-4 h-4 text-[#ff5500]" /> Notifications
                </Link>
                <Link to="/profile" onClick={onClose} className="flex items-center gap-3 text-sm text-neutral-300 py-1">
                  <User className="w-4 h-4 text-emerald-400" /> Player Profile
                </Link>
                <Link to="/settings" onClick={onClose} className="flex items-center gap-3 text-sm text-neutral-300 py-1">
                  <Settings className="w-4 h-4 text-neutral-400" /> Settings
                </Link>
              </div>
            </div>

            <Link
              to="/create-game"
              onClick={onClose}
              className="w-full bg-[#ff5500] text-white py-3 rounded text-center font-display tracking-wider font-bold uppercase shadow-lg shadow-[#ff5500]/30"
            >
              + Create A Game
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}