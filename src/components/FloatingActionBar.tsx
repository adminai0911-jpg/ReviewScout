'use client';

import { useState } from 'react';
import { Share2, Search, MessageCircle, Twitter, Facebook, X } from 'lucide-react';

export default function FloatingActionBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://review-scout-pi.vercel.app';
  const shareTitle = typeof window !== 'undefined' ? document.title : 'Check out this awesome gear!';

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-6 z-50 flex md:flex-col items-center gap-4 glass-panel p-3 rounded-full md:rounded-[2rem] shadow-2xl animate-fade-in-up">
        
        {/* Share Toggle */}
        <div className="relative group">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-indigo-500/20 hover:bg-indigo-500 text-white transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          {/* Social Platforms Popup */}
          {isOpen && (
            <div className="absolute bottom-16 md:bottom-auto md:right-16 md:top-0 left-1/2 -translate-x-1/2 md:translate-x-0 flex md:flex-col gap-2 p-2 glass-panel rounded-full md:rounded-[2rem]">
              <button onClick={() => handleShare('whatsapp')} className="p-2 rounded-full bg-green-500 hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-black hover:scale-110 transition-transform">
                <Twitter className="w-5 h-5 text-white" />
              </button>
              <button onClick={() => handleShare('facebook')} className="p-2 rounded-full bg-blue-600 hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-8 md:w-8 md:h-px bg-white/20"></div>

        {/* Search Toggle */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Full Screen Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="absolute top-6 right-6">
            <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <div className="w-full max-w-3xl glass-panel rounded-3xl p-8 relative">
            <h2 className="text-3xl font-heading font-bold text-white mb-6">Search ReviewScout</h2>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find the perfect gear..." 
                className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white text-xl placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                autoFocus
              />
            </div>
            <div className="mt-8 flex gap-3 flex-wrap">
              <span className="text-sm text-slate-400 py-1">Popular:</span>
              {['Laptops', 'Camping Gear', 'Headphones', 'Cameras', 'Smart Home'].map(term => (
                <button key={term} className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/20 text-sm transition-colors">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
