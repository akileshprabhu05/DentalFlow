import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import { setPatients, deletePatient, setSelectedPatient } from '../../store/slices/patientsSlice';
import { storage } from '../../utils/storage';
import PatientModal from './PatientModal';
import { useDispatch, useSelector } from 'react-redux';

const PatientList = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatientLocal] = useState(null);

  useEffect(() => {
    const loadedPatients = storage.getPatients();
    dispatch(setPatients(loadedPatients));
  }, [dispatch]);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddPatient = () => {
    setSelectedPatientLocal(null);
    dispatch(setSelectedPatient(null));
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatientLocal(patient);
    dispatch(setSelectedPatient(patient));
    setShowModal(true);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      dispatch(deletePatient(patientId));
      const updatedPatients = patients.filter((p) => p.id !== patientId);
      storage.savePatients(updatedPatients);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="text-gray-600 mt-1">Manage your patient records</p>
            </div>
            <button
              onClick={handleAddPatient}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Patient</span>
            </button>
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Patient List */}
        <div className="divide-y divide-gray-200">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No patients found</p>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first patient to get started'}
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.contact}
                        </div>
                        {patient.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-1" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        DOB: {new Date(patient.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {patient.healthInfo && (
                  <div className="mt-4 ml-16">
                    <p className="text-sm text-gray-600">
                      <strong>Health Info:</strong> {patient.healthInfo}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Patient Modal */}
      {showModal && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            const updatedPatients = storage.getPatients();
            dispatch(setPatients(updatedPatients));
          }}
        />
      )}
    </div>
  );
};

export default PatientList;