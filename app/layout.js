/* Layout - Main application layout
 * Updated: Added Sonner toasts, enhanced metadata, and TooltipProvider
 */

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAllTopics, getTotalVerseCount } from "@/lib/verses";
import { generateOrganizationSchema, ORG_ID, SITE_URL } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const topicCount = getAllTopics().length;
const verseCount = getTotalVerseCount().toLocaleString("en-US");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bible Says About - Discover What Scripture Says",
    template: "%s | Bible Says About"
  },
  description: `Bible verses by topic: ${topicCount} topics and ${verseCount} verses on love, strength, anxiety, grief and more, plus Bible facts counted from the full text.`,
  authors: [{ name: "Bible Says About" }],
  creator: "Bible Says About",
  publisher: "Bible Says About",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Bible Says About",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
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
};

// JSON-LD structured data for the organization
const organizationSchema = generateOrganizationSchema();

// JSON-LD structured data for the website
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bible Says About",
  url: SITE_URL,
  description: "Discover what the Bible says about any topic",
  publisher: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.biblesaysabout.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* apply the reader's saved Bible translation (KJV toggle) before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("translation")==="kjv")document.documentElement.dataset.translation="kjv"}catch(e){}`,
          }}
        />
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
        <Script
          src="https://whyusersleave.com/sdk.js"
          data-site="a9ad605b-fb38-415b-880d-c0c76522a957"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
