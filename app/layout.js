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

export const metadata = {
  metadataBase: new URL('https://biblesaysabout.com'),
  title: "Bible Says About - Find Bible Verses by Topic",
  description: "Discover meaningful Bible verses organized by topic. Find strength, hope, love, and guidance through Scripture with beautiful, animated verse cards.",
  keywords: "bible verses, scripture, bible quotes, christian faith, bible study, verses by topic",
  authors: [{ name: "Bible Says About" }],
  openGraph: {
    title: "Bible Says About - Find Bible Verses by Topic",
    description: "Discover meaningful Bible verses organized by topic. Find strength, hope, love, and guidance through Scripture.",
    type: "website",
    siteName: "Bible Says About",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Says About - Find Bible Verses by Topic",
    description: "Discover meaningful Bible verses organized by topic. Find strength, hope, love, and guidance through Scripture.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
