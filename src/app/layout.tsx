import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    canonical: 'https://reviewscout.tech',
    languages: {
      'en-US': 'https://reviewscout.tech',
      'es-ES': 'https://reviewscout.tech/es',
      'fr-FR': 'https://reviewscout.tech/fr',
      'de-DE': 'https://reviewscout.tech/de',
      'pt-BR': 'https://reviewscout.tech/pt',
      'it-IT': 'https://reviewscout.tech/it'
    },
  },
  openGraph: {
    title: "ReviewScout | Find the Perfect Gear",
    description: "Expertly curated recommendations for every profession, hobby, and budget.",
    siteName: "ReviewScout.tech",
    type: "website"
  }
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
