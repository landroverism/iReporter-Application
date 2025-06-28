import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { SignOutButton } from '../SignOutButton';

type PageType = 'home' | 'about' | 'report' | 'dashboard' | 'howItWorks';

interface NavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isLoggedIn: boolean;
}

export function Navigation({ currentPage, onNavigate, isLoggedIn }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const userProfile = useQuery(api.users.getCurrentUserProfile);

  const handleLogoClick = () => {
    onNavigate('home');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className="text-2xl">🏛️</div>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors">iReporter</h2>
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">Empowering Citizens</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'home')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'home' || currentPage === 'dashboard'
                  ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'about'
                  ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onNavigate('howItWorks')}
              className={`text-sm font-medium transition-colors ${
                currentPage === 'howItWorks'
                  ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              How It Works
            </button>
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('report')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'report'
                    ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
                    : 'text-gray-600 hover:text-teal-600'
                }`}
              >
                Create Report
              </button>
            )}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                {unreadCount !== undefined && unreadCount > 0 && (
                  <div className="relative">
                    <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  </div>
                )}
                
                {/* Profile */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 text-sm font-medium">
                      {userProfile?.name?.[0]?.toUpperCase() || userProfile?.email?.[0]?.toUpperCase() || '👤'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {userProfile?.name || userProfile?.email?.split('@')[0]}
                  </span>
                </div>
                
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const signInElement = document.getElementById('sign-in-section');
                    signInElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    const signInElement = document.getElementById('sign-in-section');
                    signInElement?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => handleNavClick('home')} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-teal-600"><i className="fa-solid fa-house mr-2"></i> Home</button>
              <button onClick={() => handleNavClick('about')} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-teal-600"><i className="fa-solid fa-info-circle mr-2"></i> About</button>
              <button onClick={() => handleNavClick('howItWorks')} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-teal-600"><i className="fa-solid fa-circle-info mr-2"></i> How It Works</button>
              {isLoggedIn && <button onClick={() => handleNavClick('report')} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-teal-600"><i className="fa-solid fa-plus mr-2"></i> Report</button>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
