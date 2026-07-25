"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "spinning" | "success" | "error">("idle");
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("leadPopupDismissed");
    if (dismissed) return;

    // Mobile fallback (since mobile has no mouseleave)
    const timer = setTimeout(() => setIsOpen(true), 20000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientY < 50 && e.movementY < 0) {
        setIsOpen(true);
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("leadPopupDismissed", "true");
  };

  const handleSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Save to Supabase (We save it before the spin in case they leave early)
    try {
      const { error } = await supabase.from('leads').insert([{ email, source: 'spin_wheel' }]);
      if (error && error.code !== '23505') throw error;
    } catch (error) {
      console.error(error);
    }

    setStatus("spinning");
    
    // Calculate a landing position that always lands on "15% Off Code" (Rigged to win)
    const extraSpins = 360 * 5; // 5 full rotations
    const riggedAngle = 45; // Lands on the specific slice
    const newRotation = rotation + extraSpins + riggedAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      setStatus("success");
    }, 4500); // Wait for CSS transition to finish
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Left Side - The Wheel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-fuchsia-700 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Confetti (only shows on success) */}
          {status === "success" && (
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-wrap justify-around items-start opacity-70">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full animate-bounce delay-${i * 100}`} style={{backgroundColor: ['#FDE047', '#38BDF8', '#F472B6'][i % 3]}}></div>
              ))}
            </div>
          )}

          <div className="relative w-64 h-64 mb-4">
            {/* The Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-400 z-20 drop-shadow-md"></div>
            
            {/* The Wheel */}
            <div 
              className="w-full h-full rounded-full border-4 border-white/20 shadow-xl overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="w-full h-full relative" style={{ background: 'conic-gradient(#fff 0 45deg, #f8fafc 45deg 90deg, #fff 90deg 135deg, #f8fafc 135deg 180deg, #fff 180deg 225deg, #f8fafc 225deg 270deg, #fff 270deg 315deg, #f8fafc 315deg 360deg)' }}>
                {/* Wheel Labels - Simplified for CSS */}
                <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-900 text-xs">
                  <span className="absolute top-4">15% OFF</span>
                  <span className="absolute bottom-4">Try Again</span>
                  <span className="absolute left-4 -rotate-90">PDF Guide</span>
                  <span className="absolute right-4 rotate-90">Free Ship</span>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-white font-black text-2xl text-center z-20 drop-shadow-md">
            {status === "success" ? "YOU WON!" : "SPIN TO WIN"}
          </h3>
        </div>

        {/* Right Side - The Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {status === "success" ? (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Jackpot!</h2>
              <p className="text-slate-600 mb-6">You won a <strong>15% OFF VIP Discount</strong> on your next tech purchase!</p>
              
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl mb-6">
                <p className="text-sm text-slate-500 mb-1">Your Promo Code:</p>
                <p className="text-2xl font-black tracking-widest text-indigo-600">VIPTECH15</p>
              </div>
              
              <button onClick={handleClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all">
                Claim My Discount
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Unlock Exclusive Deals</h2>
              <p className="text-slate-600 mb-8">Enter your email for a free spin. Win up to 50% off select tech gear and premium guides.</p>
              
              <form onSubmit={handleSpin} className="space-y-4">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your best email address"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "spinning" || status === "loading"}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === "spinning" || status === "loading" || !email}
                  className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {status === "spinning" ? "Spinning..." : "SPIN THE WHEEL NOW"}
                  {status !== "spinning" && <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
                
                <p className="text-xs text-center text-slate-400 mt-4">
                  We hate spam as much as you do. 100% secure.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
