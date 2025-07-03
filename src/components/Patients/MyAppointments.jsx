import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText, Download, Eye } from 'lucide-react';
import { setIncidents } from '../../store/slices/incidentsSlice';
import { storage } from '../../utils/storage';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';

const MyAppointments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { incidents } = useSelector((state) => state.incidents);
  const [filter, setFilter] = useState('all'); // ✅ JSX-compatible state

  useEffect(() => {
    const loadedIncidents = storage.getIncidents();
    dispatch(setIncidents(loadedIncidents));
  }, [dispatch]);

  const patientIncidents = incidents.filter(i => i.patientId === user?.patientId);

  const filteredIncidents = patientIncidents.filter(incident => {
    switch (filter) {
      case 'upcoming':
        return incident.status === 'Scheduled' && new Date(incident.appointmentDate) > new Date();
      case 'completed':
        return incident.status === 'Completed';
      case 'in-progress':
        return incident.status === 'In Progress';
      default:
        return true;
    }
  }).sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.data || file.url; // use `data` for localStorage base64 or fallback to `url`
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-1">View your appointment history and upcoming visits</p>
            </div>
          </div>

          <div className="mt-6 flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900">No appointments found</p>
              <p className="text-gray-500">
                {filter === 'all' ? 'You have no appointments yet' : `No ${filter} appointments`}
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const appointmentDate = new Date(incident.appointmentDate);
              const nextAppointmentDate = incident.nextAppointmentDate ? new Date(incident.nextAppointmentDate) : null;

              return (
                <div key={incident.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{incident.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{incident.description}</p>

                      {incident.treatment && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Treatment:</p>
                          <p className="text-sm text-blue-600">{incident.treatment}</p>
                        </div>
                      )}

                      {incident.comments && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Notes:</p>
                          <p className="text-sm text-gray-600">{incident.comments}</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(appointmentDate, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(appointmentDate, 'hh:mm a')}
                        </div>
                        {incident.cost && (
                          <div className="font-medium text-green-600">
                            Cost: ${incident.cost}
                          </div>
                        )}
                      </div>

                      {nextAppointmentDate && (
                        <div className="mt-2 text-sm text-blue-600">
                          Next appointment: {format(nextAppointmentDate, 'MMM dd, yyyy')}
                        </div>
                      )}

                      {incident.files && incident.files.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {incident.files.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => window.open(file.data || file.url, '_blank')}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="View file"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleFileDownload(file)}
                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
