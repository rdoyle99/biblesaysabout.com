import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} Bible Says About. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">
              Terms of Service
            </Link>
            <a 
              href="mailto:rpdoyle1@gmail.com" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}