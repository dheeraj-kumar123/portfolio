import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 fade-in">
      <nav className="p-6 flex justify-between items-center backdrop-blur-sm bg-white bg-opacity-10">
        <h1 className="text-3xl font-bold text-white">PortfolioHub</h1>
        <div className="space-x-4">
          <button onClick={() => onNavigate('about')} className="text-white hover:underline font-medium">
            About
          </button>
          <button 
            onClick={() => onNavigate('login')} 
            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 fade-in">
          Online Developer Portfolio 
        </h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-90">
          Create account in portfoli 
        </p>
        <button 
          onClick={() => onNavigate('login')}
          className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transform hover:scale-105 transition shadow-2xl"
        >
          Start Login 🚀
        </button>
        
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-white">
          <div className="glass p-8 rounded-2xl card-hover">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold mb-3">UPLOAD CV (Resume)</h3>
            <p className="opacity-90">plese upload your cv</p>
          </div>
          <div className="glass p-8 rounded-2xl card-hover">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-3">Easy to Use</h3>
            <p className="opacity-90">Intuitive interface - no coding required to build your portfolio</p>
          </div>
          <div className="glass p-8 rounded-2xl card-hover">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-2xl font-bold mb-3">Share Anywhere</h3>
            <p className="opacity-90">Get a unique link to share your portfolio with employers</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;