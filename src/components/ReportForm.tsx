import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { SmartAssistant } from './SmartAssistant';

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as 'red-flag' | 'intervention' | '',
    type: '',
  });
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const createReport = useMutation(api.reports.createReport);
  const generateUploadUrl = useMutation(api.reports.generateUploadUrl);
  const addReportMedia = useMutation(api.reports.addReportMedia);

  const redFlagTypes = [
    'Bribery and Corruption',
    'Embezzlement of Public Funds',
    'Abuse of Office',
    'Fraudulent Activities',
    'Nepotism and Favoritism',
    'Misuse of Government Resources',
    'Other Corruption'
  ];

  const interventionTypes = [
    'Road Repairs and Maintenance',
    'Water and Sanitation Issues',
    'Public Facility Problems',
    'Healthcare Service Issues',
    'Education Infrastructure',
    'Public Safety Concerns',
    'Environmental Issues',
    'Other Infrastructure'
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results[0]) {
              address = data.results[0].formatted;
            }
          }
          
          setLocation({ address, latitude, longitude });
          toast.success('Location captured successfully');
        } catch (error) {
          // Fallback to coordinates if geocoding fails
          setLocation({
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude,
            longitude
          });
          toast.success('Location captured (coordinates only)');
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get location. Please enter manually.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a valid image or video file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!location) {
      toast.error('Please provide location information');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportId = await createReport({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        location,
      });

      // Upload files if any
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        for (const file of selectedFiles) {
          const uploadUrl = await generateUploadUrl();
          const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
          });
          
          if (result.ok) {
            const { storageId } = await result.json();
            await addReportMedia({
              reportId,
              storageId,
              mediaType: file.type.startsWith('image/') ? 'image' : 'video',
              fileName: file.name,
            });
          }
        }
        setIsUploading(false);
      }
      
      toast.success('Report submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        type: '',
      });
      setLocation(null);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssistantSuggestion = (suggestion: { category: 'red-flag' | 'intervention'; type: string; title: string; description: string }) => {
    setFormData({
      ...formData,
      category: suggestion.category,
      type: suggestion.type,
      title: suggestion.title,
      description: suggestion.description,
    });
    setShowAssistant(false);
    toast.success('AI suggestions applied to your form!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create New Report</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Report corruption incidents or request government intervention for infrastructure issues.
            </p>
          </div>
          <button
            onClick={() => setShowAssistant(!showAssistant)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2.5 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <span>🤖</span>
            <span className="font-medium">AI Assistant</span>
          </button>
        </div>

        {/* AI Assistant */}
        {showAssistant && (
          <div className="mb-8">
            <SmartAssistant onSuggestion={handleAssistantSuggestion} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Report Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.category === 'red-flag'
                    ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-md'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                }`}
                onClick={() => setFormData({ ...formData, category: 'red-flag', type: '' })}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl sm:text-4xl">🚨</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Red Flag</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Report corruption incidents</p>
                  </div>
                </div>
              </div>
              
              <div
                className={`border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  formData.category === 'intervention'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
                onClick={() => setFormData({ ...formData, category: 'intervention', type: '' })}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl sm:text-4xl">🏗️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Intervention</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Request government intervention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Selection */}
          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white"
                required
              >
                <option value="">Select a specific type...</option>
                {(formData.category === 'red-flag' ? redFlagTypes : interventionTypes).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Brief, descriptive title for your report"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Provide detailed information about the incident or issue. Include dates, times, people involved, and any other relevant details."
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2.5 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  <span>📍</span>
                  <span className="font-medium">{isGettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
                </button>
              </div>
              
              {location ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-sm font-medium text-green-800">Location captured:</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1 break-words">{location.address}</div>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter the location manually (e.g., 123 Main St, City, State)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) => {
                    if (e.target.value) {
                      setLocation({
                        address: e.target.value,
                        latitude: 0,
                        longitude: 0
                      });
                    } else {
                      setLocation(null);
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Evidence (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors duration-200">
              <div className="text-4xl mb-3">📎</div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mb-4">Images or Videos (MAX 50MB each, 5 files max)</p>
              <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 cursor-pointer inline-block">
                Choose Files
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">{selectedFiles.length} file(s) selected:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{file.type.startsWith('image/') ? '🖼️' : '🎥'}</span>
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                    <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 transition-colors">
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  type: '',
                });
                setLocation(null);
                setSelectedFiles([]);
              }}
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting || isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isUploading ? 'Uploading...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
