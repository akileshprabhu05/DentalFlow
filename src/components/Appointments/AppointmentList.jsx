import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText,
  User,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { 
  setIncidents, 
  deleteIncident, 
  setSelectedIncident 
} from '../../store/slices/incidentsSlice';
import { storage } from '../../utils/storage';
import AppointmentModal from './AppointmentModal';
import { useDispatch, useSelector } from 'react-redux';

const AppointmentList = () => {
  const dispatch = useDispatch();
  const { incidents } = useSelector((state) => state.incidents);
  const { patients } = useSelector((state) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedIncident, setSelectedIncidentLocal] = useState(null);

  useEffect(() => {
    const loadedIncidents = storage.getIncidents();
    dispatch(setIncidents(loadedIncidents));
  }, [dispatch]);

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPatientName(incident.patientId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddIncident = () => {
    setSelectedIncidentLocal(null);
    dispatch(setSelectedIncident(null));
    setShowModal(true);
  };

  const handleEditIncident = (incident) => {
    setSelectedIncidentLocal(incident);
    dispatch(setSelectedIncident(incident));
    setShowModal(true);
  };

  const handleDeleteIncident = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      dispatch(deleteIncident(incidentId));
      const updatedIncidents = incidents.filter((i) => i.id !== incidentId);
      storage.saveIncidents(updatedIncidents);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments & Incidents</h1>
              <p className="text-gray-600 mt-1">Manage patient appointments and incidents</p>
            </div>
            <button
              onClick={handleAddIncident}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Appointment</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No appointments found</p>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'Add your first appointment to get started'
                }
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <div key={incident.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                        <User className="h-4 w-4" />
                        <span>{getPatientName(incident.patientId)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(incident.appointmentDate).toLocaleString()}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                      
                      {incident.comments && (
                        <p className="text-sm text-gray-500 italic mb-2">
                          <strong>Comments:</strong> {incident.comments}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm">
                        {incident.cost && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <DollarSign className="h-4 w-4" />
                            <span>${incident.cost}</span>
                          </div>
                        )}
                        
                        {incident.treatment && (
                          <div className="flex items-center space-x-1 text-blue-600">
                            <FileText className="h-4 w-4" />
                            <span>{incident.treatment}</span>
                          </div>
                        )}
                        
                        {incident.files && incident.files.length > 0 && (
                          <div className="flex items-center space-x-1 text-purple-600">
                            <FileText className="h-4 w-4" />
                            <span>{incident.files.length} file(s)</span>
                          </div>
                        )}
                      </div>
                      
                      {incident.nextAppointmentDate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Next Appointment:</strong> {new Date(incident.nextAppointmentDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(incident.status)}
                    <button
                      onClick={() => handleEditIncident(incident)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteIncident(incident.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          incident={selectedIncident}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            const updatedIncidents = storage.getIncidents();
            dispatch(setIncidents(updatedIncidents));
          }}
        />
      )}
    </div>
  );
};

export default AppointmentList;