import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReviewScout | Find the Perfect Gear",
  description: "Expertly curated recommendations for every profession, hobby, and budget.",
  other: {
    "google-adsense-account": "ca-pub-4477459074077400"
  },
  verification: {
    google: "bc5hPzXstw6y8lpbiXYdEHfTSZkySuSi5XR-MD4lJZQ",
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

import PushManager from "@/components/PushManager";
import AIChatAgent from "@/components/AIChatAgent";
import GlobalPromoBanner from "@/components/GlobalPromoBanner";
import TrendingTicker from "@/components/TrendingTicker";
import WebPushPrompt from "@/components/WebPushPrompt";
import FloatingActionBar from "@/components/FloatingActionBar";

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
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Impact.com Verification */}
        <meta name="impact-site-verification" content="b7f81974-6121-406a-af7d-a04020931ed0" />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-KRL5RH2H00`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KRL5RH2H00', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 overflow-x-hidden">
        {/* Amazon OneLink script (Global Geo-Monetization) */}
        <div id="amzn-assoc-ad-script-injection"></div>
        <Script src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=YOUR_AD_INSTANCE_ID" strategy="afterInteractive" />

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
                  "name": "ReviewScout",
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

        {/* Google AdSense Verification Script */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4477459074077400" 
          crossOrigin="anonymous" 
          strategy="afterInteractive"
        />

        {children}
        
        <FloatingActionBar />
        <PushManager />
        <AIChatAgent />

        {/* Skimlinks Global Monetization Script */}
        <Script strategy="afterInteractive" src="https://s.skimresources.com/js/307054X1795329.skimlinks.js" />
      </body>
    </html>
  );
}
