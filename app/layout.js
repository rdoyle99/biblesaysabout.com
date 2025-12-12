/* Layout - Main application layout
 * Updated: Added Sonner toasts, enhanced metadata, and TooltipProvider
 */

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://biblesaysabout.com'),
  title: {
    default: "Bible Says About - Discover What Scripture Says",
    template: "%s | Bible Says About"
  },
  description: "Discover what the Bible says about any topic. Explore 37+ topics with 1000+ curated verses on strength, love, hope, anxiety, healing, forgiveness, and more.",
  keywords: [
    "bible verses",
    "what does the bible say",
    "scripture",
    "bible quotes",
    "christian faith",
    "bible study",
    "verses by topic",
    "bible verses about strength",
    "bible verses about love",
    "bible verses about hope",
    "bible verses about anxiety",
    "bible verses about peace"
  ],
  authors: [{ name: "Bible Says About" }],
  creator: "Bible Says About",
  publisher: "Bible Says About",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Bible Says About - Discover What Scripture Says",
    description: "Explore 37+ topics with 1000+ curated Bible verses. Find strength, hope, love, and guidance through God's Word.",
    type: "website",
    siteName: "Bible Says About",
    locale: "en_US",
    url: "https://biblesaysabout.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bible Says About - Find Bible Verses by Topic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Says About - Discover What Scripture Says",
    description: "Explore 37+ topics with 1000+ curated Bible verses. Find strength, hope, love, and guidance through God's Word.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

// JSON-LD structured data for the organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bible Says About",
  url: "https://biblesaysabout.com",
  logo: "https://biblesaysabout.com/logo.png",
  description: "Discover what the Bible says about any topic with our comprehensive collection of curated Bible verses.",
  sameAs: [],
};

// JSON-LD structured data for the website
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bible Says About",
  url: "https://biblesaysabout.com",
  description: "Discover what the Bible says about any topic",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://biblesaysabout.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <TooltipProvider delayDuration={300}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
