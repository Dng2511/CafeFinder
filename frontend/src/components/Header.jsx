import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
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
              <p className="text-xs text-cyan-100">
                あなたの理想のカフェを見つけよう
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-cyan-100 transition-colors font-medium"
            >
              ホーム
            </Link>
            <Link
              to="/"
              className="text-white hover:text-cyan-100 transition-colors font-medium"
            >
              検索
            </Link>
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="text-white hover:text-cyan-100 transition-colors font-medium"
              >
                お気に入り
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-white hover:text-cyan-100 transition-colors font-medium"
              >
                ダッシュボード
              </Link>
            )}

            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2 bg-white text-cyan-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors shadow-md"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{user?.username}</span>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                    <div className="p-4 border-b">
                      <p className="text-sm text-gray-600">
                        ロール: <span className="font-semibold">{user?.role}</span>
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      ログアウト
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
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition-colors shadow-md"
                >
                  登録
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
