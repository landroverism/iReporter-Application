import React from 'react';

export function HowItWorks() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 rounded-full p-5">
            <i className="fa-solid fa-circle-info text-4xl text-blue-600"></i>
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">How iReporter Works</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Our platform makes it easy to report corruption, request government intervention, 
          and track progress. Follow these simple steps to make your voice heard.
        </p>
      </div>

      {/* Step-by-Step Process */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-teal-600">1</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Report</h4>
            <p className="text-gray-600">
              Submit your report with details, location, and evidence. Our AI assistant can help you categorize and articulate your issue.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Review</h4>
            <p className="text-gray-600">
              Our system processes and forwards your report to relevant authorities. You'll receive a confirmation when your report is received.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Action</h4>
            <p className="text-gray-600">
              Government agencies investigate and take appropriate action. The status of your report will be updated as progress is made.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">4</span>
            </div>
            <h4 className="font-semibold text-lg mb-3">Resolution</h4>
            <p className="text-gray-600">
              Track progress and receive updates until the issue is resolved. You can provide feedback on the resolution process.
            </p>
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Types of Reports</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <i className="fa-solid fa-flag text-xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Red Flags</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Report corruption, bribery, embezzlement, abuse of office, and other forms of misconduct by public officials.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Bribery and Corruption</li>
              <li>Embezzlement of Public Funds</li>
              <li>Abuse of Office</li>
              <li>Fraudulent Activities</li>
              <li>Nepotism and Favoritism</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <i className="fa-solid fa-hands-helping text-xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Interventions</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Request government intervention for infrastructure issues, public service problems, and community needs.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Road Repairs and Maintenance</li>
              <li>Water and Sanitation Issues</li>
              <li>Public Facility Problems</li>
              <li>Healthcare Service Issues</li>
              <li>Education Infrastructure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200 mb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
            <div className="bg-white rounded-full p-2 shadow-md">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200">
                <img src="/ai-image.avif" alt="AI Assistant" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="md:w-3/4 md:pl-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Assistant</h2>
            <p className="text-gray-700 mb-4">
              Our intelligent assistant helps you create effective reports by:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                <span>Categorizing your issue correctly</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                <span>Suggesting relevant details to include</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                <span>Improving the clarity of your description</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-2"></i>
                <span>Recommending appropriate evidence types</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4">
            <div className="text-3xl font-bold text-teal-600 mb-2">5,247</div>
            <div className="text-gray-600 text-sm">Reports Submitted</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-green-600 mb-2">3,891</div>
            <div className="text-gray-600 text-sm">Issues Resolved</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">12,456</div>
            <div className="text-gray-600 text-sm">Active Citizens</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600 text-sm">User Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
