import React from 'react';

const AppHeader: React.FC = () => (
  <header className="w-full flex flex-col items-center justify-center py-6 mb-6 bg-gradient-to-r from-blue-900 via-yellow-400 to-yellow-700 shadow-lg rounded-b-3xl">
    <div className="flex items-center gap-4">
      <img src="/images/baikal_logo.png" alt="Baikal Logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-yellow-300 bg-white object-cover" />
      <span className="inline-block rounded-full bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 p-2 shadow-lg">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="18" fill="url(#gold)"/>
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold" fill="#fff">⚖️</text>
          <defs>
            <radialGradient id="gold" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#B8860B"/>
            </radialGradient>
          </defs>
        </svg>
      </span>
      <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-montserrat drop-shadow-lg">
        JDX Team Balancer
      </span>
    </div>
    <span className="text-base md:text-lg text-white/80 font-light mt-2 text-center">
      공정하고 프리미엄급 팀 배정, 친구들과 최고의 경험을!
    </span>
  </header>
);

export default AppHeader;
