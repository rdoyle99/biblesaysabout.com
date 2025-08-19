export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700 mb-4">
            By accessing and using Bible Says About, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Use of Service</h2>
          <p className="text-slate-700 mb-4">
            You may use our service for personal, non-commercial purposes in accordance with these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Content</h2>
          <p className="text-slate-700 mb-4">
            The Bible verses and content provided on this website are for inspirational and educational purposes. 
            We strive for accuracy but recommend consulting official Bible translations for scholarly or liturgical use.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-slate-700 mb-4">
            The service and its original content, features, and functionality are owned by Bible Says About 
            and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Disclaimer</h2>
          <p className="text-slate-700 mb-4">
            The service is provided "as is" without warranties of any kind, either express or implied.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Contact</h2>
          <p className="text-slate-700 mb-4">
            If you have any questions about these Terms, please contact us at{' '}
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