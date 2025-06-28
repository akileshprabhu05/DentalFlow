import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { addPatient, updatePatient } from '../../store/slices/patientsSlice';
import { storage } from '../../utils/storage';
import { useDispatch } from 'react-redux';

const PatientModal = ({ patient, onClose, onSave }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    address: '',
    healthInfo: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        dob: patient.dob,
        contact: patient.contact,
        email: patient.email || '',
        address: patient.address || '',
        healthInfo: patient.healthInfo,
        emergencyContact: patient.emergencyContact || '',
      });
    }
  }, [patient]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const patientData = {
      id: patient?.id || `p${Date.now()}`,
      ...formData,
      createdAt: patient?.createdAt || new Date().toISOString(),
    };

    const patients = storage.getPatients();

    if (patient) {
      const updatedPatients = patients.map((p) =>
        p.id === patient.id ? patientData : p
      );
      storage.savePatients(updatedPatients);
      dispatch(updatePatient(patientData));
    } else {
      const updatedPatients = [...patients, patientData];
      storage.savePatients(updatedPatients);
      dispatch(addPatient(patientData));
    }

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {patient ? (
                  <User className="h-6 w-6 text-blue-600" />
                ) : (
                  <UserPlus className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {patient ? 'Edit Patient' : 'Add New Patient'}
                </h2>
                <p className="text-gray-500">
                  {patient
                    ? 'Update patient information'
                    : 'Enter patient details'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.dob ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Contact Number *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.contact ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter contact number"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Emergency Contact
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Name - Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Information
            </label>
            <textarea
              name="healthInfo"
              value={formData.healthInfo}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter health information, allergies, medical history, etc."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {patient ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;
