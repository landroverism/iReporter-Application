import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

export function UserProfile() {
  const userProfile = useQuery(api.users.getCurrentUserProfile);
  const updateUserProfile = useMutation(api.users.updateUserProfile);
  const makeUserAdmin = useMutation(api.users.makeUserAdmin);
  const checkAndPromoteAdmin = useMutation(api.users.checkAndPromoteAdmin);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    bio: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMakingAdmin, setIsMakingAdmin] = useState(false);

  React.useEffect(() => {
    if (userProfile?.profile) {
      setFormData({
        phoneNumber: userProfile.profile.phoneNumber || '',
        bio: userProfile.profile.bio || '',
      });
    }
    
    // Auto-promote admin if email matches
    if (userProfile?.email === "vocalunion8@gmail.com") {
      checkAndPromoteAdmin();
    }
  }, [userProfile, checkAndPromoteAdmin]);

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateUserProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!confirm('Are you sure you want to make yourself an admin? This action cannot be undone.')) {
      return;
    }

    setIsMakingAdmin(true);
    try {
      await makeUserAdmin({ userId: userProfile._id });
      toast.success('You are now an admin! Please refresh the page.');
    } catch (error) {
      console.error('Error making admin:', error);
      toast.error('Failed to make admin. You may not have permission.');
    } finally {
      setIsMakingAdmin(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-gray-800">
                {userProfile.name || 'Not provided'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-gray-800 break-words">
                {userProfile.email || 'Not provided'}
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-gray-800">
                {userProfile.profile?.phoneNumber || 'Not provided'}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us about yourself"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-gray-800 min-h-[80px]">
                {userProfile.profile?.bio || 'No bio provided'}
              </div>
            )}
          </div>

          {/* Admin Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                userProfile.profile?.isAdmin 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {userProfile.profile?.isAdmin ? '👑 Admin' : '👤 User'}
              </div>
              {!userProfile.profile?.isAdmin && (
                <button
                  onClick={handleMakeAdmin}
                  disabled={isMakingAdmin}
                  className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
                >
                  {isMakingAdmin ? 'Processing...' : 'Become Admin'}
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2.5 px-4 rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    phoneNumber: userProfile.profile?.phoneNumber || '',
                    bio: userProfile.profile?.bio || '',
                  });
                }}
                className="px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Member since:</span>
            <div className="font-medium">
              {new Date(userProfile._creationTime).toLocaleDateString()}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Profile completed:</span>
            <div className="font-medium">
              {userProfile.profile ? '✅ Yes' : '❌ No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
