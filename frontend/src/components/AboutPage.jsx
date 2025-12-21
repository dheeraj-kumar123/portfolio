import React from 'react';

function AboutPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400 fade-in">
      <nav className="p-6 flex justify-between items-center backdrop-blur-sm bg-white bg-opacity-10">
        <h1 
          className="text-3xl font-bold text-white cursor-pointer hover:scale-105 transition" 
          onClick={() => onNavigate('home')}
        >
          PortfolioHub
        </h1>
        <button 
          onClick={() => onNavigate('login')} 
          className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition"
        >
          Get Started
        </button>
      </nav>
      
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold text-white mb-8 text-center">About PortfolioHub</h2>
        <div className="glass rounded-2xl p-8 text-white max-w-4xl mx-auto">
          <p className="text-lg mb-4 leading-relaxed">
            PortfolioHub is a modern platform designed to help developers create professional portfolios quickly and easily.
          </p>
          <p className="text-lg mb-4 leading-relaxed">
            Whether you're a student, freelancer, or experienced developer, our platform provides all the tools you need to showcase your skills, projects, and experience.
          </p>
          <h3 className="text-2xl font-bold mt-8 mb-4">✨ Key Features:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-3">📱</span>
              <span>Multiple professional templates</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🎨</span>
              <span>Customizable themes and colors</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">💼</span>
              <span>Project showcase with live demos</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">📊</span>
              <span>Skills visualization with progress bars</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🎓</span>
              <span>Education and experience timeline</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">📞</span>
              <span>Contact information management</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🔗</span>
              <span>Unique shareable portfolio links</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;