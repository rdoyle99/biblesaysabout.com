export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-700 mb-4">
            We collect information you provide directly to us, such as when you contact us or use our services.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-700 mb-4">
            We use the information we collect to provide, maintain, and improve our services.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Analytics</h2>
          <p className="text-slate-700 mb-4">
            We use Simple Analytics to track website usage. Simple Analytics is a privacy-friendly analytics service that doesn't use cookies or collect personal information.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Data Security</h2>
          <p className="text-slate-700 mb-4">
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p className="text-slate-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:rpdoyle1@gmail.com" className="text-blue-600 hover:text-blue-800">
              rpdoyle1@gmail.com
            </a>
          </p>
        </div>

        <div className="mt-12">
          <a 
            href="/" 
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}