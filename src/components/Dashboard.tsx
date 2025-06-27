import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ReportForm } from './ReportForm';
import { ReportsList } from './ReportsList';
import { AdminPanel } from './AdminPanel';
import { UserProfile } from './UserProfile';
import { NotificationCenter } from './NotificationCenter';

type TabType = 'overview' | 'create' | 'reports' | 'admin' | 'profile' | 'notifications';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const userProfile = useQuery(api.users.getCurrentUserProfile);
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const isAdmin = userProfile.profile?.isAdmin;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <i className="fa-solid fa-house"></i> },
    { id: 'create', label: 'Create Report', icon: <i className="fa-solid fa-plus"></i> },
    { id: 'reports', label: 'My Reports', icon: <i className="fa-solid fa-clipboard-list"></i> },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: <i className="fa-solid fa-gear"></i> }] : []),
    { id: 'notifications', label: `Notifications${unreadCount ? ` (${unreadCount})` : ''}`, icon: <i className="fa-solid fa-bell"></i> },
    { id: 'profile', label: 'Profile', icon: <i className="fa-solid fa-user"></i> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {userProfile.name || userProfile.email}!
        </h1>
        <p className="text-gray-600">
          {isAdmin ? 'Admin Dashboard - Manage reports and users' : 'Manage your reports and track their progress'}
        </p>
      </div>

      {/* Navigation Tabs - Desktop */}
      <div className="border-b border-gray-200 mb-6 hidden sm:block">
        <nav className="-mb-px flex justify-between max-w-4xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600 bg-teal-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2 text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Navigation Tabs - Mobile */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-700">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabType)}
              className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="text-xs truncate w-full text-center">
                {tab.id === 'notifications' ? 'Notif' + (unreadCount ? ` (${unreadCount})` : '') : tab.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'create' && <ReportForm />}
        {activeTab === 'reports' && <ReportsList />}
        {activeTab === 'admin' && isAdmin && <AdminPanel />}
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'notifications' && <NotificationCenter />}
      </div>
    </div>
  );
}

function DashboardOverview() {
  const userReports = useQuery(api.reports.getUserReports);
  const userProfile = useQuery(api.users.getCurrentUserProfile);

  if (!userReports) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const statusCounts = userReports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryCounts = userReports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-teal-600">{userReports.length}</div>
          <div className="text-gray-600">Total Reports</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-600">{statusCounts['under-investigation'] || 0}</div>
          <div className="text-gray-600">Under Investigation</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">{statusCounts.resolved || 0}</div>
          <div className="text-gray-600">Resolved</div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
        {userReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p>No reports yet. Create your first report to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userReports.slice(0, 5).map((report) => (
              <div key={report._id} className="border-l-4 border-teal-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {report.category.replace('-', ' ')} • {report.status.replace('-', ' ')}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(report._creationTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Report Corruption</h3>
          <p className="mb-4 opacity-90">
            Report incidents of corruption, bribery, or misconduct by public officials.
          </p>
          <div className="text-2xl font-bold">{categoryCounts['red-flag'] || 0}</div>
          <div className="text-sm opacity-75">Red Flag Reports</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Request Intervention</h3>
          <p className="mb-4 opacity-90">
            Request government intervention for infrastructure or public service issues.
          </p>
          <div className="text-2xl font-bold">{categoryCounts.intervention || 0}</div>
          <div className="text-sm opacity-75">Intervention Requests</div>
        </div>
      </div>
    </div>
  );
}
