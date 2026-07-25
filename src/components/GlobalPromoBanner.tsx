"use client";

import React, { useState, useEffect } from 'react';

const promos = {
  en: [
    "🔥 Huge Summer Sale - Up to 40% Off Premium Gear",
    "🚀 Flash Deal: Free Global Shipping Ends Tonight",
    "⭐ Voted #1 AI-Powered Recommendation Engine 2026",
    "💎 Exclusive: Unlock Insider Pricing on Top Tech"
  ],
  es: [
    "🔥 Gran Venta de Verano - Hasta 40% de Descuento",
    "🚀 Oferta Relámpago: Envío Global Gratis Termina Hoy",
    "⭐ Votado #1 Motor de Recomendación con IA 2026",
    "💎 Exclusivo: Precios de Informante en Tecnología"
  ],
  fr: [
    "🔥 Grande Vente d'Été - Jusqu'à 40% de Réduction",
    "🚀 Offre Éclair : Livraison Mondiale Gratuite Ce Soir",
    "⭐ Élu Moteur de Recommandation IA #1 en 2026",
    "💎 Exclusif : Débloquez des Prix d'Initié"
  ],
  de: [
    "🔥 Großer Sommerschlussverkauf - Bis zu 40% Rabatt",
    "🚀 Blitzangebot: Kostenloser Weltweiter Versand",
    "⭐ Gewählt zur #1 KI-Empfehlungsmaschine 2026",
    "💎 Exklusiv: Insider-Preise für Top-Technik"
  ],
  pt: [
    "🔥 Grande Venda de Verão - Até 40% de Desconto",
    "🚀 Oferta Relâmpago: Frete Global Grátis Termina Hoje",
    "⭐ Votado #1 Motor de Recomendação de IA 2026",
    "💎 Exclusivo: Desbloqueie Preços Especiais"
  ],
  it: [
    "🔥 Grandi Saldi Estivi - Fino al 40% di Sconto",
    "🚀 Offerta Lampo: Spedizione Globale Gratuita Oggi",
    "⭐ Votato #1 Motore di Raccomandazione IA 2026",
    "💎 Esclusivo: Prezzi Insider sulla Migliore Tecnologia"
  ],
  hi: [
    "🔥 विशाल ग्रीष्मकालीन सेल - प्रीमियम गियर पर 40% तक की छूट",
    "🚀 फ्लैश डील: मुफ्त वैश्विक शिपिंग आज रात समाप्त हो रही है",
    "⭐ 2026 का #1 AI-संचालित अनुशंसा इंजन चुना गया",
    "💎 विशेष: शीर्ष तकनीक पर इनसाइडर मूल्य निर्धारण अनलॉक करें"
  ]
};

export default function GlobalPromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState('en');
  const [isVisible, setIsVisible] = useState(true);
  const [animateSlide, setAnimateSlide] = useState(true);

  useEffect(() => {
    try {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (promos[browserLang as keyof typeof promos]) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLang(browserLang);
      }
    } catch {
      // fallback to 'en'
    }

    const interval = setInterval(() => {
      setAnimateSlide(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % 4);
        setAnimateSlide(true);
      }, 500); // Wait for fade out
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const currentPromos = promos[lang as keyof typeof promos] || promos['en'];

  return (
    <div className="sticky top-0 z-[100] overflow-hidden shadow-md">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-[length:200%_auto] animate-gradient-x"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-12">
          
          {/* Left spacer for centering */}
          <div className="hidden sm:block w-10"></div>
          
          {/* Animated Text Carousel */}
          <div className="flex-1 flex justify-center items-center overflow-hidden h-full">
            <div 
              className={`text-white font-bold text-sm sm:text-base tracking-wide flex items-center gap-3 transition-all duration-500 ease-in-out transform ${
                animateSlide ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
            >
              {currentPromos[currentIndex]}
              
              <a href="#" className="hidden sm:inline-flex items-center justify-center px-3 py-1 text-xs font-black bg-white text-indigo-600 rounded-full hover:bg-indigo-50 hover:scale-105 transition-transform uppercase tracking-wider shadow-sm ml-2">
                {lang === 'es' ? 'Explorar' : lang === 'fr' ? 'Explorer' : lang === 'de' ? 'Entdecken' : lang === 'pt' ? 'Explorar' : lang === 'it' ? 'Esplora' : lang === 'hi' ? 'खोजें' : 'Explore Now'}
                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>

          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
            aria-label="Close banner"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
