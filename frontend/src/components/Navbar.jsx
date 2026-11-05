import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, FileText, ShieldCheck, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isEditor = location.pathname.startsWith('/editor');

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <FileText size={19} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1">
                ResumeCraft <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Professional Resume Builder
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          {!isEditor && (
            <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
              <Link to="/templates" className="hover:text-blue-600 transition-colors">
                Templates
              </Link>
              <Link to="/ats-checker" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" />
                ATS Scanner
              </Link>
              <a href="/#features" className="hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="/#how-it-works" className="hover:text-blue-600 transition-colors">
                How It Works
              </a>
              <a href="/#faq" className="hover:text-blue-600 transition-colors">
                FAQ
              </a>
            </div>
          )}

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>
                </div>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Resumes
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-1.5"
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 text-xs font-semibold text-slate-700">
          <Link
            to="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            Resume Templates
          </Link>
          <Link
            to="/ats-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600 flex items-center gap-1.5"
          >
            <ShieldCheck size={14} className="text-emerald-600" />
            ATS Keyword Scanner
          </Link>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            Features
          </a>
          <a
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-blue-600"
          >
            FAQ
          </a>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-blue-600 font-bold"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-rose-600 font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 border border-slate-200 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
