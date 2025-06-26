import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

export function NotificationCenter() {
  const notifications = useQuery(api.notifications.getUserNotifications);
  const markNotificationRead = useMutation(api.notifications.markNotificationRead);
  const markAllNotificationsRead = useMutation(api.notifications.markAllNotificationsRead);

  const handleMarkAsRead = async (notificationId: Id<"notifications">) => {
    try {
      await markNotificationRead({ notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  if (!notifications) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_update': return '📋';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'status_update': return 'border-l-blue-500';
      case 'system': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Notifications</h3>
          <p className="text-gray-600">
            You'll receive notifications here when there are updates to your reports.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm mr-2">
                  {unreadNotifications.length}
                </span>
                Unread Notifications
              </h3>
              <div className="space-y-3">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-white border-l-4 ${getNotificationColor(notification.type)} rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow`}
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="text-xs text-gray-500">
                            {new Date(notification._creationTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Previous Notifications
              </h3>
              <div className="space-y-3">
                {readNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-gray-50 border-l-4 ${getNotificationColor(notification.type)} rounded-lg p-4 opacity-75`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl opacity-60">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-700 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {notification.message}
                        </p>
                        <div className="text-xs text-gray-500">
                          {new Date(notification._creationTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
