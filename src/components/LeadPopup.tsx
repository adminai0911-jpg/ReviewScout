"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("leadPopupDismissed");
    if (dismissed) return;

    // Mobile fallback (since mobile has no mouseleave)
    const timer = setTimeout(() => setIsOpen(true), 25000);

    const handleMouseLeave = (e: MouseEvent) => {
      // If cursor moves rapidly towards the top of the browser window
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
    setHasDismissed(true);
    localStorage.setItem("leadPopupDismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, source: 'lead_popup' }]);

      if (error) {
        if (error.code === '23505') {
          // Unique violation (already subscribed)
          setStatus("success"); 
        } else {
          throw error;
        }
      } else {
        setStatus("success");
      }
      
      // Auto close after 3 seconds of success
      setTimeout(() => {
        handleClose();
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md p-8 overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🛑</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Wait! Don't buy anything <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">yet.</span>
          </h2>
          <p className="text-zinc-400 mb-6">
            Get today's secret Amazon discounts, hidden price drops, and top-rated buyer's guides sent directly to your inbox before you checkout.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center animate-in zoom-in duration-300">
            <h3 className="font-semibold text-lg mb-1">You're in! 🎉</h3>
            <p className="text-sm opacity-90">Check your inbox shortly for your first exclusive alert.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your best email..." 
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {status === "loading" ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                "Send Me The Secrets 🚀"
              )}
            </button>
            {status === "error" && (
              <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
        
        <p className="text-xs text-zinc-600 text-center mt-6">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
