'use client';

import { highlightKeywords } from '../lib/highlightKeywords';

export default function VerseCard({ verse, showAnimation = true, currentTopic = null }) {
  const { text, reference, translation = "NIV", theme = "default" } = verse;
  
  // Generate shareable content
  const shareText = `"${text}" - ${reference} (${translation})`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      copy: null // Handle copy separately
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareText).then(() => {
        // Could add a toast notification here
        alert('Verse copied to clipboard!');
      });
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };
  
  // Theme-based styling
  const themeStyles = {
    default: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200",
    strength: "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200",
    love: "bg-gradient-to-br from-rose-50 to-pink-100 border-rose-200",
    peace: "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200",
    hope: "bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200",
    faith: "bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200"
  };

  const currentTheme = themeStyles[theme] || themeStyles.default;

  // Theme-specific animations
  const getThemeAnimation = () => {
    switch (theme) {
      case 'love':
        return (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
            {/* Floating hearts - positioned in safe corners */}
            <div className="absolute top-2 right-2 text-xl animate-pulse group-hover:animate-bounce">❤️</div>
            <div className="absolute top-2 left-2 text-lg animate-pulse delay-300 group-hover:animate-bounce">💕</div>
            <div className="absolute bottom-2 right-2 text-lg animate-pulse delay-500 group-hover:animate-bounce">💖</div>
            <div className="absolute bottom-2 left-2 text-sm animate-pulse delay-700 group-hover:animate-bounce">💝</div>
            {/* Heart particles - centered but subtle */}
            <div className="absolute top-1/3 right-1/4 transform">
              <div className="w-6 h-6 bg-red-200 rounded-full opacity-15 animate-ping"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/4 transform">
              <div className="w-4 h-4 bg-pink-300 rounded-full opacity-20 animate-ping delay-200"></div>
            </div>
          </div>
        );
      
      case 'peace':
        return (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
            {/* Flying dove - starts and ends in safe zones */}
            <div className="absolute top-2 left-2 text-xl transform group-hover:translate-x-6 group-hover:-translate-y-1 transition-transform duration-1000 ease-out">🕊️</div>
            {/* Olive branches - corner positioned */}
            <div className="absolute top-2 right-2 text-lg group-hover:rotate-12 transition-transform duration-700 delay-200">🌿</div>
            <div className="absolute bottom-2 left-2 text-lg group-hover:-rotate-12 transition-transform duration-700 delay-400">🌿</div>
            {/* Peaceful waves - bottom edge only */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-100/30 to-transparent transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700"></div>
            {/* Gentle glow - subtle center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-200 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-1000"></div>
          </div>
        );
      
      case 'strength':
        return (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
            {/* Mountain peaks - bottom edge only */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-200/30 to-transparent transform translate-y-12 group-hover:translate-y-0 transition-transform duration-700">
              <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-300/50"></div>
              <div className="absolute bottom-0 right-4 w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-blue-400/50"></div>
            </div>
            {/* Lightning bolt - top right corner */}
            <div className="absolute top-2 right-2 text-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">⚡</div>
            {/* Shield - top left corner */}
            <div className="absolute top-2 left-2 text-lg group-hover:scale-105 transition-transform duration-500">🛡️</div>
            {/* Power aura - subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/5 to-indigo-300/5 rounded-lg transform scale-95 group-hover:scale-100 transition-transform duration-500"></div>
          </div>
        );
      
      case 'hope':
        return (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
            {/* Rising sun - top right corner */}
            <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-700 ease-out">
              <div className="absolute inset-0 bg-yellow-200 rounded-full animate-ping opacity-30"></div>
            </div>
            {/* Stars - corner positioned */}
            <div className="absolute top-2 left-2 text-lg animate-pulse group-hover:animate-bounce delay-200">⭐</div>
            <div className="absolute bottom-2 right-2 text-sm animate-pulse group-hover:animate-bounce delay-400">✨</div>
            <div className="absolute bottom-2 left-2 text-lg animate-pulse group-hover:animate-bounce delay-600">🌟</div>
            {/* Golden glow - subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 to-amber-200/10 rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-700"></div>
          </div>
        );
      
      case 'faith':
        return (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
            {/* Cross - top right */}
            <div className="absolute top-2 right-2 text-xl group-hover:scale-110 transition-transform duration-500">✝️</div>
            {/* Praying hands - top left */}
            <div className="absolute top-2 left-2 text-lg group-hover:scale-105 transition-transform duration-500 delay-200">🙏</div>
            {/* Church - bottom right */}
            <div className="absolute bottom-2 right-2 text-lg group-hover:scale-105 transition-transform duration-500 delay-400">⛪</div>
            {/* Bible - bottom left */}
            <div className="absolute bottom-2 left-2 text-lg group-hover:scale-105 transition-transform duration-500 delay-600">📖</div>
            {/* Spiritual glow - subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200/10 to-violet-200/10 rounded-lg transform scale-90 group-hover:scale-100 transition-transform duration-700"></div>
          </div>
        );
      
      default:
        return (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 blur-2xl transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 blur-xl transform -translate-x-12 translate-y-12 group-hover:-translate-x-4 group-hover:translate-y-4 transition-transform duration-700 delay-100"></div>
          </div>
        );
    }
  };

  return (
    <div className={`verse-card group relative overflow-hidden rounded-lg border p-6 ${currentTheme} ${showAnimation ? 'hover:shadow-lg hover:shadow-slate-200/50 animate-rolodex-bounce' : ''} cursor-pointer`}>
      {/* Theme-specific animated elements */}
      {showAnimation && getThemeAnimation()}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Verse text */}
        <blockquote 
          className="scripture-text text-lg text-slate-700 mb-4 leading-relaxed group-hover:text-slate-800 transition-colors duration-300"
          dangerouslySetInnerHTML={{ 
            __html: `"${currentTopic ? highlightKeywords(text, currentTopic) : text}"` 
          }}
        />
        
        {/* Reference and Share buttons */}
        <div className="flex items-center justify-between">
          <cite className="verse-reference text-slate-600 not-italic group-hover:text-slate-700 transition-colors duration-300">
            <span className="font-medium">{reference}</span>
            <span className="text-xs bg-slate-200 px-2 py-1 rounded-full group-hover:bg-white/80 transition-colors duration-300 ml-2">{translation}</span>
          </cite>
          
          {/* Share buttons (appear on hover) */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => handleShare('copy')}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
              title="Copy verse"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
            
            <button
              onClick={() => handleShare('twitter')}
              className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              title="Share on Twitter"
            >
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            
            <button
              onClick={() => handleShare('facebook')}
              className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
              title="Share on Facebook"
            >
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            
            <button
              onClick={() => handleShare('pinterest')}
              className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-200"
              title="Share on Pinterest"
            >
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Theme-colored bottom border on hover */}
      {showAnimation && (
        <div className={`absolute bottom-0 left-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
          theme === 'love' ? 'bg-gradient-to-r from-rose-400 to-pink-500' :
          theme === 'peace' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
          theme === 'strength' ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
          theme === 'hope' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
          theme === 'faith' ? 'bg-gradient-to-r from-purple-400 to-violet-500' :
          'bg-gradient-to-r from-slate-400 to-slate-500'
        }`}></div>
      )}
    </div>
  );
}