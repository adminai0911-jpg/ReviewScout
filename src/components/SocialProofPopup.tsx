"use client";

import { useState, useEffect } from 'react';

const names = ['John D.', 'Sarah M.', 'Michael T.', 'Emily R.', 'David L.', 'Jessica W.', 'James H.', 'Emma C.'];
const locations = ['New York, USA', 'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia', 'Texas, USA', 'California, USA', 'Paris, France'];
const actions = ['just purchased through our link', 'is reading this guide right now', 'just saved 15% using our AI recommendation'];

export default function SocialProofPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ name: '', location: '', action: '', time: '' });

  useEffect(() => {
    // Initial delay before first popup
    const initialTimer = setTimeout(() => {
      triggerPopup();
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  const triggerPopup = () => {
    // Generate random data
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomTime = Math.floor(Math.random() * 59) + 1; // 1 to 59 mins ago

    setData({
      name: randomName,
      location: randomLoc,
      action: randomAction,
      time: `${randomTime} mins ago`
    });

    setIsVisible(true);

    // Hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Trigger next popup in 15-30 seconds
      const nextDelay = Math.floor(Math.random() * 15000) + 15000;
      setTimeout(triggerPopup, nextDelay);
    }, 6000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] animate-fade-in-up">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.2)] rounded-2xl p-4 flex items-center gap-4 max-w-sm">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-inner">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <p className="text-sm text-slate-300">
            <span className="font-bold text-white">{data.name}</span> in <span className="font-semibold text-indigo-300">{data.location}</span>
          </p>
          <p className="text-xs font-medium text-emerald-400 mt-0.5">{data.action}</p>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">{data.time} • Verified</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}
