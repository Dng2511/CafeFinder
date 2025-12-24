import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Search, Heart, Coffee, LogOut, User, PlusCircle, LayoutDashboard, Store } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white p-2 rounded-lg shadow-md group-hover:bg-cyan-50 transition-colors">
              <Coffee className="w-8 h-8 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CafeFinder</h1>
              <p className="text-xs text-cyan-100">
                あなたの理想のカフェを見つけよう
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            
            {isAdmin ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-1 text-white hover:text-cyan-100 transition-colors font-medium"
                >
                  <Search className="w-4 h-4" />
                  <span>ホーム </span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 text-white hover:text-cyan-100 transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>承認 </span>
                </Link>
              </>
            ) : (
              
              <>
                <Link
                  to="/"
                  className="flex items-center gap-1 text-white hover:text-cyan-100 transition-colors font-medium"
                >
                  <Search className="w-4 h-4" />
                  <span>検索</span>
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-1 text-white hover:text-cyan-100 transition-colors font-medium"
                    >
                      <Heart className="w-4 h-4" />
                      <span>お気に入り</span>
                    </Link>
                    <Link
                      to="/create-cafe"
                      className="flex items-center gap-1 text-white hover:text-cyan-100 transition-colors font-medium"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>カフェ作り</span>
                    </Link>
                    <Link
                      to="/my-cafes"
                      className="flex items-center gap-1 text-white hover:text-cyan-100 transition-colors font-medium"
                    >
                      <Store className="w-4 h-4" />
                      <span>私のカフェ</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 bg-white text-cyan-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.username}</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10 overflow-hidden border border-gray-100">
                    <div className="p-4 border-b bg-gray-50">
                      <p className="text-sm text-gray-600">
                        ロール: <span className="font-bold text-cyan-600 uppercase">{user?.role}</span>
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ログアウト</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-white text-cyan-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors shadow-md"
                >
                  ログイン
                </Link>
                <Link
                  to="/register"
                  className="bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-800 transition-colors shadow-md border border-cyan-600"
                >
                  登録
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-white p-1">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;