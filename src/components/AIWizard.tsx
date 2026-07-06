"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function AIWizard() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-indigo-100 rounded-3xl p-8 shadow-xl max-w-3xl mx-auto -mt-10 relative z-20">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex justify-center items-center gap-2">
          <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          AI Perfect Match Wizard
        </h3>
        <p className="text-slate-500 font-medium mt-2">Tell us exactly what you need, and we'll find the perfect gear.</p>
      </div>

      <form onSubmit={handleSearch} className="relative flex items-center mb-4">
        <div className="absolute left-4 flex items-center justify-center pointer-events-none">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., I need a cheap vlogging camera for youtube..." 
          className="w-full pl-14 pr-32 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-lg font-medium text-slate-700 shadow-inner"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl transition-all shadow-md flex items-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Searching...
            </span>
          ) : 'Match Me'}
        </button>
      </form>

      {searched && (
        <div className="mt-6 animate-fade-in-up">
          {results.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">Top Matches Found</p>
              {results.map((res, i) => (
                <Link href={`/article/${res.slug}`} key={i} className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 truncate">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold shrink-0">
                      #{i + 1}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-slate-800 group-hover:text-indigo-600 truncate">{res.title}</p>
                      <p className="text-xs text-slate-500 capitalize">{res.category?.replace('-', ' ')} • {res.language}</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-500 font-medium">No perfect matches found. Try using simpler keywords!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
