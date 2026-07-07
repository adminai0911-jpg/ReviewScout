import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewScout | Find the Perfect Gear",
  description: "Expertly curated recommendations for every profession, hobby, and budget.",
  verification: {
    google: "j-mQs3Pv3ReJuzkgkgBGVr0A6P-GnDnABftQbbCLuic",
  },
  alternates: {
    canonical: 'https://review-scout-pi.vercel.app',
    languages: {
      'en-US': 'https://review-scout-pi.vercel.app',
      'es-ES': 'https://review-scout-pi.vercel.app/es',
      'fr-FR': 'https://review-scout-pi.vercel.app/fr',
      'de-DE': 'https://review-scout-pi.vercel.app/de',
      'pt-BR': 'https://review-scout-pi.vercel.app/pt',
      'it-IT': 'https://review-scout-pi.vercel.app/it'
    },
  },
  openGraph: {
    title: "ReviewScout | Find the Perfect Gear",
    description: "Expertly curated recommendations for every profession, hobby, and budget.",
    siteName: "review-scout-pi.vercel.app",
    type: "website"
  }
};

import LeadPopup from "@/components/LeadPopup";
import PushManager from "@/components/PushManager";
import AIChatAgent from "@/components/AIChatAgent";
import LiveSalesPopup from "@/components/LiveSalesPopup";
import GlobalPromoBanner from "@/components/GlobalPromoBanner";
import SocialProofPopup from "@/components/SocialProofPopup";
import TrendingTicker from "@/components/TrendingTicker";
import WebPushPrompt from "@/components/WebPushPrompt";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">
        <GlobalPromoBanner />
        <TrendingTicker />
        <WebPushPrompt />
        
        {/* Massive AI-GEO Global Schema */}
        <Script id="global-schema" type="application/ld+json" strategy="beforeInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://review-scout-pi.vercel.app/#website",
                  "url": "https://review-scout-pi.vercel.app",
                  "name": "ReviewScout.tech",
                  "description": "Expertly curated AI-driven recommendations for every profession, hobby, and budget.",
                  "publisher": {
                    "@id": "https://review-scout-pi.vercel.app/#organization"
                  },
                  "inLanguage": "en-US"
                },
                {
                  "@type": "Organization",
                  "@id": "https://review-scout-pi.vercel.app/#organization",
                  "name": "ReviewScout",
                  "url": "https://review-scout-pi.vercel.app",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://review-scout-pi.vercel.app/favicon.ico"
                  },
                  "sameAs": [
                    "https://twitter.com/reviewscout",
                    "https://www.linkedin.com/company/reviewscout"
                  ]
                }
              ]
            }
          `}
        </Script>
        
        {/* Analytics and Interactivity */}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script strategy="lazyOnload" id="ga-script">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>

        {children}
        
        {/* Global Components */}
        <LeadPopup />
        <LiveSalesPopup />
        <PushManager />
        <AIChatAgent />
      </body>
    </html>
  );
}
