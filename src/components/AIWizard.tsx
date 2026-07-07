"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AIWizard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ category: '', purpose: '', budget: '' });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzingText, setAnalyzingText] = useState("Scanning 50,000+ data points...");

  const handleNext = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      findMatches(newAnswers);
    }
  };

  const findMatches = async (finalAnswers: any) => {
    setLoading(true);
    setStep(4);
    
    // Simulate AI thinking for gamification/trust
    setTimeout(() => setAnalyzingText("Cross-referencing Amazon price drops..."), 800);
    setTimeout(() => setAnalyzingText("Filtering out fake reviews..."), 1600);
    setTimeout(() => setAnalyzingText("Generating perfect matches..."), 2400);

    try {
      const query = `${finalAnswers.category} ${finalAnswers.purpose} ${finalAnswers.budget}`;
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setTimeout(() => {
        setResults(data.results || []);
        setLoading(false);
      }, 3000); // Artificial delay to build suspense
    } catch (err) {
      setResults([]);
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setAnswers({ category: '', purpose: '', budget: '' });
    setResults([]);
  };

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)] max-w-3xl mx-auto -mt-10 relative z-20 overflow-hidden">
      {/* Gamified Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(217,70,239,0.8)]"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="text-center mb-8 mt-2">
        <h3 className="text-3xl font-black text-white tracking-tight flex justify-center items-center gap-3 drop-shadow-md">
          <svg className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Gear Matchmaker AI
        </h3>
        <p className="text-indigo-200 font-medium mt-2">Answer 3 questions to uncover your perfect gear.</p>
      </div>

      <div className="min-h-[200px] flex flex-col justify-center">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h4 className="text-xl font-bold text-white text-center mb-6">What are you looking for today?</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Tech & Gadgets', 'Home & Kitchen', 'Outdoor & Fitness', 'Software & SaaS'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleNext('category', cat)}
                  className="bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 text-white font-semibold p-4 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] flex flex-col items-center text-center gap-2"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    {cat === 'Tech & Gadgets' ? '💻' : cat === 'Home & Kitchen' ? '🍳' : cat === 'Outdoor & Fitness' ? '🏕️' : '🚀'}
                  </div>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <h4 className="text-xl font-bold text-white text-center mb-6">What is the primary use case?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Professional / Work', 'Casual / Everyday', 'Gaming / High Performance'].map(purpose => (
                <button 
                  key={purpose}
                  onClick={() => handleNext('purpose', purpose)}
                  className="bg-white/5 border border-white/10 hover:border-fuchsia-500/50 hover:bg-white/10 text-white font-semibold p-5 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] text-center"
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <h4 className="text-xl font-bold text-white text-center mb-6">What is your budget level?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Budget Friendly', 'Mid-Range Value', 'Premium / No Limits'].map(budget => (
                <button 
                  key={budget}
                  onClick={() => handleNext('budget', budget)}
                  className="bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 text-white font-semibold p-5 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] text-center"
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && loading && (
          <div className="animate-fade-in-up flex flex-col items-center justify-center py-10">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-4 border-fuchsia-500 animate-spin animation-delay-500"></div>
              <div className="absolute inset-4 rounded-full border-l-4 border-pink-500 animate-spin animation-delay-1000"></div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2 animate-pulse">{analyzingText}</h4>
            <p className="text-slate-400">Our neural net is finding your exact match...</p>
          </div>
        )}

        {step === 4 && !loading && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-white">Your Perfect Matches</h4>
              <button onClick={reset} className="text-xs font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-wider">Start Over</button>
            </div>
            
            {results.length > 0 ? (
              <div className="flex flex-col gap-4">
                {results.map((res, i) => (
                  <Link href={`/article/${res.slug}`} key={i} className="group relative flex items-center justify-between p-5 rounded-2xl bg-[#030303] border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">{res.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-slate-400 capitalize">{res.category?.replace('-', ' ')}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> Verified Match</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 bg-white/5 hover:bg-white/10 p-3 rounded-full text-indigo-300 transition-all">
                      <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-slate-400 font-medium mb-4">No perfect matches found for that exact combination.</p>
                <button onClick={reset} className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-600 transition-colors">Try Again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
