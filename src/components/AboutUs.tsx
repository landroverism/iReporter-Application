import React from 'react';

export function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-100 rounded-full p-6">
            <div className="text-6xl">🏛️</div>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">About iReporter</h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Empowering citizens to create positive change through transparent reporting and 
          government accountability. Together, we're building a more just and responsive society.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            To create a transparent, accountable, and responsive government by empowering citizens 
            with the tools they need to report corruption, request interventions, and track progress. 
            We believe that every voice matters and that collective action can drive meaningful change.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8">
          <div className="text-4xl mb-4">👁️</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            A world where corruption is eliminated, public services are efficient, and citizens 
            have direct access to responsive governance. We envision communities where transparency 
            is the norm and accountability is guaranteed.
          </p>
        </div>
      </div>

      {/* Motto Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-2xl p-12 text-center mb-16">
        <div className="text-5xl mb-6">💪</div>
        <h2 className="text-4xl font-bold mb-4">Our Motto</h2>
        <p className="text-2xl font-semibold mb-2">"Your Voice, Our Platform, Real Change"</p>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Every report matters. Every citizen counts. Every action creates ripples of positive change.
        </p>
      </div>

      {/* What We Do */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🚨</div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Corruption Reporting</h3>
            <p className="text-gray-600">
              Provide a secure platform for citizens to report corruption incidents, bribery, 
              embezzlement, and other forms of misconduct by public officials.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">🏗️</div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Intervention Requests</h3>
            <p className="text-gray-600">
              Enable citizens to request government intervention for infrastructure issues, 
              public service problems, and community needs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">📊</div>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Progress Tracking</h3>
            <p className="text-gray-600">
              Track the status of reports and interventions, ensuring transparency and 
              accountability in government responses.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 rounded-2xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-semibold mb-2 text-gray-800">Security</h4>
            <p className="text-sm text-gray-600">
              Protecting user privacy and ensuring safe, anonymous reporting.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">🌟</div>
            <h4 className="font-semibold mb-2 text-gray-800">Transparency</h4>
            <p className="text-sm text-gray-600">
              Open processes and clear communication at every step.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">⚖️</div>
            <h4 className="font-semibold mb-2 text-gray-800">Integrity</h4>
            <p className="text-sm text-gray-600">
              Maintaining the highest ethical standards in all our operations.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-3">🤝</div>
            <h4 className="font-semibold mb-2 text-gray-800">Collaboration</h4>
            <p className="text-sm text-gray-600">
              Working together with citizens and government for positive change.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How iReporter Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-teal-600">1</span>
            </div>
            <h4 className="font-semibold mb-2">Report</h4>
            <p className="text-sm text-gray-600">
              Submit your report with details, location, and evidence.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold mb-2">Review</h4>
            <p className="text-sm text-gray-600">
              Our system processes and forwards your report to relevant authorities.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <h4 className="font-semibold mb-2">Action</h4>
            <p className="text-sm text-gray-600">
              Government agencies investigate and take appropriate action.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">4</span>
            </div>
            <h4 className="font-semibold mb-2">Resolution</h4>
            <p className="text-sm text-gray-600">
              Track progress and receive updates until the issue is resolved.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold text-teal-600 mb-2">5,247</div>
            <div className="text-gray-600">Reports Submitted</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">3,891</div>
            <div className="text-gray-600">Issues Resolved</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">12,456</div>
            <div className="text-gray-600">Active Citizens</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
