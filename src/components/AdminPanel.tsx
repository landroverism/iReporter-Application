import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

type StatusFilter = 'all' | 'pending' | 'under-investigation' | 'resolved' | 'rejected';
type CategoryFilter = 'all' | 'red-flag' | 'intervention';

export function AdminPanel() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [selectedReport, setSelectedReport] = useState<Id<"reports"> | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminComment, setAdminComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const reports = useQuery(api.reports.getAllReports, {
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });

  const updateReportStatus = useMutation(api.reports.updateReportStatus);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !newStatus) return;

    setIsUpdating(true);
    try {
      await updateReportStatus({
        reportId: selectedReport,
        status: newStatus as any,
        adminComment: adminComment.trim() || undefined,
      });
      
      toast.success('Report status updated successfully');
      setSelectedReport(null);
      setNewStatus('');
      setAdminComment('');
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!reports) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-investigation': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'red-flag' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <div className="text-sm text-gray-600">
          {reports.length} report{reports.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under-investigation">Under Investigation</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="red-flag">Red Flag</option>
              <option value="intervention">Intervention</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid gap-6">
        {reports.map((report) => (
          <div key={report._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                    {report.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  Reported by: {report.user?.name || report.user?.email || 'Unknown'}
                </div>
                
                {report.type && (
                  <div className="text-sm text-gray-600 mb-2">Type: {report.type}</div>
                )}
                
                <p className="text-gray-700 mb-3">{report.description}</p>
                
                <div className="text-sm text-gray-600 mb-2">
                  📍 {report.location.address}
                </div>
                
                <div className="text-xs text-gray-500">
                  Submitted: {new Date(report._creationTime).toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedReport(report._id);
                  setNewStatus(report.status);
                  setAdminComment(report.adminComment || '');
                }}
                className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Update Status
              </button>
            </div>

            {/* Current Admin Comment */}
            {report.adminComment && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Current Admin Comment:</div>
                <div className="text-sm text-gray-600">{report.adminComment}</div>
              </div>
            )}

            {/* Media */}
            {report.media && report.media.length > 0 && (
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Evidence:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {report.media.map((item) => (
                    <div key={item._id} className="relative">
                      {item.mediaType === 'image' ? (
                        <img
                          src={item.url || ''}
                          alt={item.fileName}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer"
                          onClick={() => window.open(item.url || '', '_blank')}
                        />
                      ) : (
                        <video
                          src={item.url || ''}
                          className="w-full h-24 object-cover rounded-lg"
                          controls
                        />
                      )}
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {item.mediaType === 'image' ? '📷' : '🎥'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status Update Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Report Status</h3>
            
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="under-investigation">Under Investigation</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Comment (Optional)
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Add a comment about this status update..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReport(null);
                    setNewStatus('');
                    setAdminComment('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
