"use client";
import { useState, useEffect } from 'react';

export default function WebPushPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 10 seconds of reading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a0a0a] border border-indigo-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(99,102,241,0.2)] text-center relative overflow-hidden animate-fade-in-up">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-[50px] z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-[40px] z-0 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 rotate-3">
            <svg className="w-10 h-10 text-white -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          
          <h2 className="text-2xl font-black text-white tracking-tight mb-3">
            Want 80% Off Amazon Glitches?
          </h2>
          
          <p className="text-slate-400 mb-8 font-medium">
            Our AI detects Amazon pricing errors and flash sales <strong className="text-indigo-400">before they get patched</strong>. Turn on notifications to get instant alerts.
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                alert("Push Notifications Enabled! (Simulated for this demo)");
                setIsVisible(false);
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-1"
            >
              Enable Flash Alerts 🚀
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-full bg-transparent hover:bg-white/5 text-slate-500 hover:text-slate-300 font-bold py-4 px-6 rounded-xl transition-all"
            >
              No thanks, I like paying full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
