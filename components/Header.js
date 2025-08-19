'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 bg-grid">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-slate-900">Bible Says About</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/verses/strength" className="text-slate-600 hover:text-slate-900 transition-colors">
              Popular Topics
            </Link>
            <Link href="/#all-topics" className="text-slate-600 hover:text-slate-900 transition-colors">
              All Topics
            </Link>
            <a href="mailto:rpdoyle1@gmail.com" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <Link 
              href="/verses/strength" 
              className="block py-2 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Popular Topics
            </Link>
            <Link 
              href="/#all-topics" 
              className="block py-2 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Topics
            </Link>
            <a 
              href="mailto:rpdoyle1@gmail.com" 
              className="block py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}