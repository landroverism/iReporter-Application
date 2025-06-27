import React from 'react';

type PageType = 'home' | 'about' | 'report' | 'dashboard';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-2xl font-bold text-teal-400">iReporter</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Empowering citizens to report corruption and request government intervention 
              for a more transparent and accountable society.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="text-xl">📘</span>
              </button>
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="text-xl">🐦</span>
              </button>
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="text-xl">📷</span>
              </button>
              <button className="text-gray-400 hover:text-teal-400 transition-colors">
                <span className="text-xl">💼</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-teal-400">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('report')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Report Issues
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Track Reports
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-teal-400">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-teal-400">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-teal-400">📧</span>
                <a href="mailto:hamsimotwo@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  hamsimotwo@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-teal-400">📱</span>
                <a href="https://wa.me/254713593401" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  +254 713 593 401
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-teal-400">📍</span>
                <span className="text-gray-300">Syokimau, Nairobi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-teal-400">🕒</span>
                <span className="text-gray-300">24/7 Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-2 text-teal-400">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest updates on transparency initiatives and platform improvements.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-lg focus:outline-none focus:border-teal-400 text-white"
              />
              <button className="bg-teal-600 text-white px-6 py-2 rounded-r-lg hover:bg-teal-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-400 mb-1">5,247</div>
              <div className="text-gray-400 text-sm">Reports Submitted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400 mb-1">3,891</div>
              <div className="text-gray-400 text-sm">Issues Resolved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400 mb-1">12,456</div>
              <div className="text-gray-400 text-sm">Active Citizens</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400 mb-1">98%</div>
              <div className="text-gray-400 text-sm">User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              © {currentYear} iReporter. All rights reserved. Fighting corruption, one report at a time.
            </div>
            <div className="flex space-x-6">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
