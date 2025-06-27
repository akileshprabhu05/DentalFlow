import React, { useState } from 'react';
import { storage } from '../../utils/storage';

const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'];

const statusColors = {
  Scheduled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  'No Show': 'bg-gray-50 text-gray-700 border-gray-200',
  Rescheduled: 'bg-orange-50 text-orange-700 border-orange-200',
};

const NewAppointmentModal = ({ patients, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled',
    nextAppointmentDate: '',
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const file = e.target.files[0];
      const base64 = await storage.saveFile(file);
      const newFile = {
        id: `f${Date.now()}`,
        name: file.name,
        url: base64,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      setFormData((prev) => ({ ...prev, files: [...(prev.files || []), newFile] }));
      setUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: (prev.files || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const allIncidents = storage.getIncidents();
    const now = new Date().toISOString();
    const newIncident = {
      id: `i${Date.now()}`,
      ...formData,
      createdAt: now,
      updatedAt: now,
    };
    storage.saveIncidents([...allIncidents, newIncident]);
    onSave();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">New Appointment</h2>
              <p className="text-indigo-100 text-sm mt-1">Schedule a new patient appointment</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Patient Selection */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Patient Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                  <select 
                    name="patientId" 
                    value={formData.patientId} 
                    onChange={handleChange} 
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  {errors.patientId && <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.patientId}
                  </p>}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g., Routine Checkup"
                      />
                      {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.title}
                      </p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date & Time *</label>
                      <input 
                        type="datetime-local" 
                        name="appointmentDate" 
                        value={formData.appointmentDate} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                      {errors.appointmentDate && <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {errors.appointmentDate}
                      </p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                      <input 
                        type="text" 
                        name="treatment" 
                        value={formData.treatment} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g., Dental Cleaning"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <div className="relative">
                        <select 
                          name="status" 
                          value={formData.status} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none bg-white"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[formData.status] || 'bg-gray-100 text-gray-800'}`}>
                          <div className="w-2 h-2 rounded-full bg-current opacity-60 mr-2"></div>
                          {formData.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cost (₹)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">₹</span>
                        </div>
                        <input 
                          type="number" 
                          name="cost" 
                          value={formData.cost || ''} 
                          onChange={handleChange} 
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Next Appointment Date</label>
                      <input 
                        type="datetime-local" 
                        name="nextAppointmentDate" 
                        value={formData.nextAppointmentDate || ''} 
                        onChange={handleChange} 
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Additional details about the appointment..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                    <textarea 
                      name="comments" 
                      value={formData.comments} 
                      onChange={handleChange} 
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Any additional comments or notes..."
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">File Attachments</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                    <div className="relative">
                      <input 
                        type="file" 
                        onChange={handleFileChange} 
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-emerald-300 rounded-lg px-4 py-6 text-center focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                          <div className="flex items-center text-emerald-600">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(formData.files || []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                      <div className="space-y-2">
                        {(formData.files || []).map((file, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 truncate block"
                                  >
                                    {file.name}
                                  </a>
                                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{file.type}</span>
                                    <span>•</span>
                                    <span>{Math.round(file.size / 1024)} KB</span>
                                  </div>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveFile(idx)} 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Appointment
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentModal;