import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <svg 
                className="w-8 h-8 text-cyan-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CafeFinder</h1>
              <p className="text-xs text-cyan-100">あなたの理想のカフェを見つけよう</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-cyan-100 transition-colors font-medium">
              ホーム
            </a>
            <a href="#" className="text-white hover:text-cyan-100 transition-colors font-medium">
              検索
            </a>
            <a href="#" className="text-white hover:text-cyan-100 transition-colors font-medium">
              お気に入り
            </a>
            <button className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors shadow-md">
              ログイン
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
