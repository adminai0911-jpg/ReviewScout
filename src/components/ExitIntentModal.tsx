'use client';

import React, { useState, useEffect } from 'react';

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Only trigger once per session
    if (sessionStorage.getItem('exitIntentTriggered')) {
      return;
    }

    // Trigger after 15 seconds of reading
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasTriggered(true);
      sessionStorage.setItem('exitIntentTriggered', 'true');
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden max-w-lg w-full transform transition-all p-8 sm:p-12 text-center border border-slate-700/50">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Fancy Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500 rounded-full blur-[100px] opacity-10 -ml-20 -mb-20 pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 transform -rotate-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">Wait! Don't leave empty-handed.</h2>
          <p className="text-slate-400 mb-8 text-base leading-relaxed">
            Download our exclusive <strong className="text-white">2026 B2B Software & Tech Buyer's Guide PDF</strong> for free before you go. Join 15,000+ smart professionals.
          </p>

          <form action="/api/newsletter" method="POST" className="space-y-4">
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email address..." 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all"
            />
            <button 
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Send Me The Free Guide
            </button>
          </form>
          
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-6 text-sm text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-4 decoration-slate-700"
          >
            No thanks, I don't want free resources.
          </button>
        </div>
      </div>
    </div>
  );
}
