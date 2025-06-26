import React, { useState } from 'react';

interface LandingPageProps {
  onStartReporting: () => void;
  onLearnMore: () => void;
}

export function LandingPage({ onStartReporting, onLearnMore }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a message - in a real app this would search reports/FAQs
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <div className="space-y-16">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 text-white py-20 px-6 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <div className="text-6xl">🏛️</div>
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-yellow-300">iReporter</span>
          </h1>
          <p className="text-xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
            Empowering citizens to report corruption incidents and request government intervention 
            for infrastructure issues. Your voice matters in building a better, more transparent society.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports, help articles, or FAQs..."
                className="w-full px-6 py-4 text-gray-800 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors"
              >
                🔍 Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStartReporting}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Start Reporting Now
            </button>
            <button 
              onClick={onLearnMore}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-teal-700 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
          <div className="text-gray-600">Available Reporting</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-gray-600">Secure & Anonymous</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">Fast</div>
          <div className="text-gray-600">Government Response</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
          <div className="text-gray-600">Reports Resolved</div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🚨</div>
              <h3 className="text-2xl font-bold">Red Flag</h3>
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">Report Corruption</h4>
            <p className="text-gray-600 mb-4">
              Report incidents of corruption, bribery, embezzlement, or any other form of 
              misconduct by public officials or institutions.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Bribery and kickbacks</li>
              <li>• Misuse of public funds</li>
              <li>• Abuse of office</li>
              <li>• Fraudulent activities</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold">Intervention</h3>
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">Request Intervention</h4>
            <p className="text-gray-600 mb-4">
              Request government intervention for infrastructure issues, public services, 
              or community needs that require official attention.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Road repairs and maintenance</li>
              <li>• Water and sanitation issues</li>
              <li>• Public facility problems</li>
              <li>• Community safety concerns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Choose iReporter */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose iReporter?
        </h3>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Our platform provides all the tools you need to report issues effectively and track their resolution progress.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">🔒</div>
            </div>
            <h4 className="font-semibold mb-3 text-lg">Anonymous Reporting</h4>
            <p className="text-gray-600 text-sm">
              Report incidents safely with complete anonymity protection and secure data handling.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">📍</div>
            </div>
            <h4 className="font-semibold mb-3 text-lg">GPS Location Tracking</h4>
            <p className="text-gray-600 text-sm">
              Precise location tracking with GPS integration for accurate incident reporting.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">📱</div>
            </div>
            <h4 className="font-semibold mb-3 text-lg">Media Evidence</h4>
            <p className="text-gray-600 text-sm">
              Upload photos and videos as evidence to support your reports and strengthen your case.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">🔔</div>
            </div>
            <h4 className="font-semibold mb-3 text-lg">Real-time Updates</h4>
            <p className="text-gray-600 text-sm">
              Get notifications on report status changes and government response updates.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">👥</div>
            </div>
            <h4 className="font-semibold mb-3 text-lg">Community Impact</h4>
            <p className="text-gray-600 text-sm">
              Join thousands of citizens working together to create positive change in our communities.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl">📊</div>
            </div>
            <h4 className="font-semibold mb-3 text-lg">Transparency</h4>
            <p className="text-gray-600 text-sm">
              Track progress and see real results as government agencies respond to citizen reports.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg p-12 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
        <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
          Join thousands of citizens who are already using iReporter to create positive change in their communities. 
          Your voice matters, and together we can build a more transparent and accountable society.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onStartReporting}
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors"
          >
            Start Reporting Now
          </button>
          <button 
            onClick={onLearnMore}
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-teal-700 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
