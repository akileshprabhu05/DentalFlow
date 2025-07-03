import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, Calendar, DollarSign, User } from 'lucide-react';
import { setPatients } from '../../store/slices/patientsSlice';
import { setIncidents } from '../../store/slices/incidentsSlice';
import { storage } from '../../utils/storage';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';

const MyRecords = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { patients } = useSelector((state) => state.patients);
  const { incidents } = useSelector((state) => state.incidents);
  const [selectedYear, setSelectedYear] = useState('all'); // ✅ No type

  useEffect(() => {
    const loadedPatients = storage.getPatients();
    const loadedIncidents = storage.getIncidents();
    dispatch(setPatients(loadedPatients));
    dispatch(setIncidents(loadedIncidents));
  }, [dispatch]);

  const currentPatient = patients.find(p => p.id === user?.patientId);
  const patientIncidents = incidents.filter(i => i.patientId === user?.patientId);

  const years = [...new Set(patientIncidents.map(i => new Date(i.appointmentDate).getFullYear().toString()))].sort().reverse();

  const filteredIncidents = selectedYear === 'all'
    ? patientIncidents
    : patientIncidents.filter(i => new Date(i.appointmentDate).getFullYear().toString() === selectedYear);

  const completedTreatments = filteredIncidents.filter(i => i.status === 'Completed');
  const totalCost = completedTreatments.reduce((sum, incident) => sum + (incident.cost || 0), 0);
  const totalFiles = filteredIncidents.reduce((sum, incident) => sum + (incident.files?.length || 0), 0);

  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.data || file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentPatient) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          Patient profile not found. Please contact the administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header and Year Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <p className="text-gray-600 mt-1">View your complete dental treatment history</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Treatments" value={completedTreatments.length} icon={<FileText className="h-6 w-6 text-blue-600" />} bg="bg-blue-100" />
        <SummaryCard title="Total Cost" value={`$${totalCost}`} icon={<DollarSign className="h-6 w-6 text-green-600" />} bg="bg-green-100" />
        <SummaryCard title="Files & Documents" value={totalFiles} icon={<FileText className="h-6 w-6 text-purple-600" />} bg="bg-purple-100" />
        <SummaryCard title="Years of Care" value={years.length} icon={<Calendar className="h-6 w-6 text-orange-600" />} bg="bg-orange-100" />
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PatientInfo patient={currentPatient} />
        </div>
      </div>

      {/* Treatment History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Treatment History</h2>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>

        {filteredIncidents.length === 0 ? (
          <EmptyState selectedYear={selectedYear} />
        ) : (
          <div className="space-y-6">
            {filteredIncidents
              .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
              .map((incident) => {
                const appointmentDate = new Date(incident.appointmentDate);
                return (
                  <div key={incident.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                        <p className="text-gray-600 mt-1">{incident.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{format(appointmentDate, 'MMM dd, yyyy')}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          incident.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          incident.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          incident.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>

                    {incident.treatment && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Treatment Provided:</p>
                        <p className="text-sm text-blue-600 mt-1">{incident.treatment}</p>
                      </div>
                    )}

                    {incident.comments && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Doctor's Notes:</p>
                        <p className="text-sm text-gray-600 mt-1">{incident.comments}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {incident.cost && (
                          <div className="text-sm">
                            <span className="text-gray-500">Cost: </span>
                            <span className="font-medium text-green-600">${incident.cost}</span>
                          </div>
                        )}
                        {incident.nextAppointmentDate && (
                          <div className="text-sm">
                            <span className="text-gray-500">Next Visit: </span>
                            <span className="font-medium text-blue-600">
                              {format(new Date(incident.nextAppointmentDate), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>

                      {incident.files && incident.files.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Files:</span>
                          <div className="flex space-x-2">
                            {incident.files.map((file, index) => (
                              <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                                <FileText className="h-3 w-3 text-gray-500" />
                                <span className="text-xs text-gray-700">{file.name}</span>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => window.open(file.url || file.data, '_blank')}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="View file"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleFileDownload(file)}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Download file"
                                  >
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable components

const SummaryCard = ({ title, value, icon, bg }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bg}`}>
        {icon}
      </div>
    </div>
  </div>
);

const PatientInfo = ({ patient }) => (
  <>
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Personal Details</h3>
      <div className="space-y-3">
        <Info label="Full Name" value={patient.name} />
        <Info label="Date of Birth" value={format(new Date(patient.dob), 'MMM dd, yyyy')} />
        <Info label="Contact" value={patient.contact} />
        {patient.email && <Info label="Email" value={patient.email} />}
      </div>
    </div>
    <div>
      <h3 className="font-medium text-gray-900 mb-4">Health Information</h3>
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">{patient.healthInfo || 'No health information recorded'}</p>
      </div>
      {patient.emergencyContact && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Emergency Contact</p>
          <p className="font-medium text-gray-900">{patient.emergencyContact}</p>
        </div>
      )}
    </div>
  </>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

const EmptyState = ({ selectedYear }) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <p className="text-lg font-medium text-gray-900">No records found</p>
    <p className="text-gray-500">
      {selectedYear === 'all' ? 'No treatment records available' : `No records for ${selectedYear}`}
    </p>
  </div>
);

export default MyRecords;
