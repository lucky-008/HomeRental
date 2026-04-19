import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

export default function Navbar({ listingMode, setListingMode, onLoginClick }) {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
  };

  const navClass = isHome && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white text-gray-800 shadow-md';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-xl">🏠</span>
            </div>
            <span className="font-black text-2xl tracking-tight text-gray-900">
              Nest<span className="text-amber-500">Luck</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium hover:text-amber-500 transition-colors ${location.pathname === '/' ? 'text-amber-500' : ''}`}>Home</Link>
            <Link to="/properties" className={`text-sm font-medium hover:text-amber-500 transition-colors ${location.pathname === '/properties' ? 'text-amber-500' : ''}`}>Properties</Link>
            <Link to="/about" className={`text-sm font-medium hover:text-amber-500 transition-colors ${location.pathname === '/about' ? 'text-amber-500' : ''}`}>About</Link>
            <Link to="/contact" className={`text-sm font-medium hover:text-amber-500 transition-colors ${location.pathname === '/contact' ? 'text-amber-500' : ''}`}>Contact</Link>
          </div>

          {/* Mode toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Rent/Buy Toggle */}
            <div className={`flex rounded-full p-1 text-sm font-semibold ${isHome && !scrolled ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}> 
              <button
                onClick={() => setListingMode('buy')}
                className={`px-4 py-1.5 rounded-full transition-all ${listingMode === 'buy' ? 'bg-amber-500 text-white shadow' : 'hover:bg-white/30'}`}
              >
                Buy
              </button>
              <button
                onClick={() => setListingMode('rent')}
                className={`px-4 py-1.5 rounded-full transition-all ${listingMode === 'rent' ? 'bg-amber-500 text-white shadow' : 'hover:bg-white/30'}`}
              >
                Rent
              </button>
            </div>
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-semibold text-amber-600 hover:underline px-3">Dashboard</Link>
                <span className="text-sm font-semibold text-gray-700 px-3">Hi, {user.username}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-lg hover:shadow-amber-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 ${isHome && !scrolled ? 'bg-white' : 'bg-gray-800'} transition-all`}></span>
              <span className={`block w-6 h-0.5 ${isHome && !scrolled ? 'bg-white' : 'bg-gray-800'} transition-all`}></span>
              <span className={`block w-4 h-0.5 ${isHome && !scrolled ? 'bg-white' : 'bg-gray-800'} transition-all`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-4 px-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setListingMode('buy'); setMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm ${listingMode === 'buy' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Buy
              </button>
              <button
                onClick={() => { setListingMode('rent'); setMenuOpen(false); }}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm ${listingMode === 'rent' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Rent
              </button>
            </div>
            {[['/', 'Home'], ['/properties', 'Properties'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="block py-3 text-gray-700 font-medium border-b border-gray-100 last:border-0 hover:text-amber-500">
                {label}
              </Link>
            ))}
            {user ? (
              <>
                <span className="block text-center text-gray-700 font-semibold py-2">Hi, {user.username}</span>
                <button onClick={handleSignOut} className="w-full mt-3 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { onLoginClick(); setMenuOpen(false); }} className="w-full mt-3 py-2.5 bg-amber-500 text-white font-semibold rounded-lg">Sign In</button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
