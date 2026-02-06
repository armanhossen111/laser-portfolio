import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MD Arman - Laser Operator & Pattern Engineer | Precision Manufacturing",
  description: "Professional CO2 laser operator and footwear pattern engineer with 5 years of experience. Specializing in precision laser cutting, pattern grading, and custom manufacturing solutions.",
  keywords: ["laser cutting", "CO2 laser operator", "pattern engineering", "footwear design", "laser engraving", "precision manufacturing", "Bangladesh"],
  authors: [{ name: "MD Arman" }],
  creator: "MD Arman",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mdarmanlaser.com",
    title: "MD Arman - Laser Operator & Pattern Engineer",
    description: "Professional CO2 laser operator and footwear pattern engineer with 5 years of experience in precision manufacturing.",
    siteName: "MD Arman Laser Craft",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MD Arman Laser Craft Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Arman - Laser Operator & Pattern Engineer",
    description: "Professional CO2 laser operator with 5 years of experience in precision manufacturing.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "4gZTxt_A4Les46UsfOvLfgUPIxhSYs6UUFSYp2LLFpE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "MD Arman",
    "jobTitle": "CO2 Laser Operator & Footwear Pattern Engineer",
    "description": "Professional laser operator and pattern engineer with 5 years of experience",
    "email": "mdarmanhosseny2003@gmail.com",
    "telephone": "+880-1777884821",
    "url": "https://mdarmanlaser.com",
    "sameAs": [
      // Add your social media links here
    ],
    "knowsAbout": ["Laser Cutting", "CO2 Laser Operation", "Pattern Engineering", "Footwear Design", "Laser Engraving"],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Laser Operator and Pattern Engineer",
      "occupationLocation": {
        "@type": "Country",
        "name": "Bangladesh"
      }
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://deziebvydthoxcgpnluv.supabase.co" />
        <link rel="dns-prefetch" href="https://deziebvydthoxcgpnluv.supabase.co" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased selection:bg-safety-orange selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
