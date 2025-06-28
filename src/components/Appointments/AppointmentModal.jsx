import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Calendar, User, DollarSign, FileText, Clock } from 'lucide-react';
import { storage } from '../../utils/storage';
import { useSelector } from 'react-redux';

const AppointmentModal = ({ incident, onClose, onSave }) => {
  const { patients } = useSelector((state) => state.patients);
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Scheduled',
    nextAppointmentDate: '',
    files: [],
    createdAt: '',
    updatedAt: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (incident) {
      setFormData({
        ...incident,
        appointmentDate: incident.appointmentDate 
          ? new Date(incident.appointmentDate).toISOString().slice(0, 16)
          : '',
        nextAppointmentDate: incident.nextAppointmentDate 
          ? new Date(incident.nextAppointmentDate).toISOString().slice(0, 16)
          : '',
        cost: incident.cost || '',
        createdAt: incident.createdAt || '',
        updatedAt: incident.updatedAt || '',
        files: incident.files || [],
      });
    } else {
      const now = new Date().toISOString();
      setFormData(prev => ({
        ...prev,
        createdAt: now,
        updatedAt: now,
      }));
    }
  }, [incident]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Please select a patient';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    }

    if (formData.cost && isNaN(parseFloat(formData.cost))) {
      newErrors.cost = 'Please enter a valid cost amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      updatedAt: new Date().toISOString()
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...fileNames],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const incidentData = {
        ...formData,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        nextAppointmentDate: formData.nextAppointmentDate 
          ? new Date(formData.nextAppointmentDate).toISOString() 
          : null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        updatedAt: new Date().toISOString(),
      };

      if (incident) {
        storage.updateIncident({ 
          ...incidentData, 
          id: incident.id,
          createdAt: incident.createdAt
        });
      } else {
        const newId = 'i' + Date.now();
        storage.addIncident({
          ...incidentData,
          id: newId,
          createdAt: incidentData.createdAt
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving incident:', error);
      setErrors({ submit: 'Failed to save incident. Please try again.' });
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleString();
  };

  const getSelectedPatientName = () => {
    const patient = patients.find(p => p.id === formData.patientId);
    return patient ? patient.name : 'None selected';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {incident ? 'Edit Appointment' : 'Add New Appointment'}
              </h2>
              {incident && (
                <div className="mt-1 text-sm text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Created: {formatDateTime(formData.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated: {formatDateTime(formData.updatedAt)}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Patient *
            </label>
            <select
              id="patientId"
              name="patientId"
              value={formData.patientId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.patientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} {patient.email ? `(${patient.email})` : ''}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>
            )}
            {formData.patientId && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {getSelectedPatientName()}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Routine Cleaning, Root Canal, Emergency Visit"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the appointment, procedure, or reason for visit"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Appointment Date & Time *
              </label>
              <input
                type="datetime-local"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Comments & Notes
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={2}
              placeholder="Additional notes, patient feedback, or observations"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {formData.status === 'Completed' && (
            <div className="border-t pt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Completion Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Cost
                  </label>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cost ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cost && (
                    <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nextAppointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Next Appointment
                  </label>
                  <input
                    type="datetime-local"
                    id="nextAppointmentDate"
                    name="nextAppointmentDate"
                    value={formData.nextAppointmentDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Provided
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Detailed description of treatment provided, procedures performed, medications prescribed, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              Attachments
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT
            </p>
            
            {formData.files.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">Attached Files:</p>
                {formData.files.map((fileName, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      {fileName}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {incident ? 'Update Appointment' : 'Add Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;