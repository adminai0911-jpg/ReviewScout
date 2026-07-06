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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col">
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
