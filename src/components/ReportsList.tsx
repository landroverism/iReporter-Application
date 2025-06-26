import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

export function ReportsList() {
  const reports = useQuery(api.reports.getUserReports);
  const deleteReport = useMutation(api.reports.deleteReport);
  const [deletingId, setDeletingId] = useState<Id<"reports"> | null>(null);

  const handleDelete = async (reportId: Id<"reports">) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    setDeletingId(reportId);
    try {
      await deleteReport({ reportId });
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    } finally {
      setDeletingId(null);
    }
  };

  if (!reports) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reports Yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't submitted any reports yet. Create your first report to get started.
        </p>
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
        <h2 className="text-2xl font-bold text-gray-800">My Reports</h2>
        <div className="text-sm text-gray-600">
          {reports.length} report{reports.length !== 1 ? 's' : ''}
        </div>
      </div>

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
              
              {report.status === 'pending' && (
                <button
                  onClick={() => handleDelete(report._id)}
                  disabled={deletingId === report._id}
                  className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                >
                  {deletingId === report._id ? '...' : 'Delete'}
                </button>
              )}
            </div>

            {/* Admin Comment */}
            {report.adminComment && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Admin Comment:</div>
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
                          className="w-full h-24 object-cover rounded-lg"
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
    </div>
  );
}
