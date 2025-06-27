import React, { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { format, parseISO, isToday, isThisMonth } from 'date-fns';
import AppointmentCard from './AppointmentCard';
import QuickStatsRow from '../Dashboard/QuickStatsRow';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import NewAppointmentModal from './NewAppointmentModal';

const statusOptions = ['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const viewOptions = ['List', 'Card'];

const AppointmentsPage = ({ patients }) => {
  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('Card');
  const [detailsIncident, setDetailsIncident] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    setIncidents(storage.getIncidents());
  }, []);

  const todayAppointments = incidents.filter(i => isToday(parseISO(i.appointmentDate))).length;
  const pendingTreatments = incidents.filter(i => i.status === 'Scheduled' || i.status === 'In Progress').length;
  const completedMonth = incidents.filter(i => i.status === 'Completed' && isThisMonth(parseISO(i.appointmentDate))).length;
  const cancelledToday = incidents.filter(i => i.status === 'Cancelled' && isToday(parseISO(i.appointmentDate))).length;

  const filteredIncidents = incidents.filter((incident) => {
    const patient = patients.find((p) => p.id === incident.patientId);
    const matchesStatus = statusFilter === 'All' || incident.status === statusFilter;
    const matchesSearch = !search || (patient && patient.name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleNewAppointment = () => setShowNewModal(true);
  const handleExport = () => alert('Export to CSV/PDF coming soon!');
  const handleView = (id) => {
    const incident = incidents.find(i => i.id === id);
    setDetailsIncident(incident || null);
  };
  const handleEdit = (id) => alert('Edit appointment coming soon!');
  const handleCancel = (id) => alert('Cancel appointment coming soon!');
  const handleComplete = (id) => alert('Complete appointment coming soon!');
  const handleReschedule = (id) => alert('Reschedule appointment coming soon!');

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    const classes = statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-sm text-gray-600 mt-1">Manage patient appointments and treatments</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Total: <span className="font-semibold text-gray-900">{filteredIncidents.length}</span>
              </div>
              <button 
                onClick={handleNewAppointment} 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6">
          <QuickStatsRow
            todayAppointments={todayAppointments}
            pendingTreatments={pendingTreatments}
            completedMonth={completedMonth}
            cancelledToday={cancelledToday}
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative flex-1 min-w-0 sm:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'All Status' : status}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Export Button */}
                <button 
                  onClick={handleExport}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-3">View:</span>
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  {viewOptions.map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        view === v 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {v === 'Card' ? (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Card
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          List
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment List/Card View */}
        {view === 'Card' ? (
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {search || statusFilter !== 'All' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating your first appointment.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const patient = patients.find((p) => p.id === incident.patientId);
                return (
                  <AppointmentCard
                    key={incident.id}
                    incident={incident}
                    patient={patient}
                    onView={() => handleView(incident.id)}
                    onEdit={() => handleEdit(incident.id)}
                    onCancel={() => handleCancel(incident.id)}
                    onComplete={() => handleComplete(incident.id)}
                    onReschedule={() => handleReschedule(incident.id)}
                  />
                );
              })
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Treatment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                          <p className="text-sm text-gray-500">
                            {search || statusFilter !== 'All' 
                              ? 'Try adjusting your search or filter criteria.'
                              : 'Get started by creating your first appointment.'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((incident) => {
                      const patient = patients.find((p) => p.id === incident.patientId);
                      return (
                        <tr key={incident.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {patient ? patient.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {patient ? patient.name : 'Unknown Patient'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {patient?.contact}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {incident.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(parseISO(incident.appointmentDate), 'MMM d, yyyy')}
                            <div className="text-sm text-gray-500">
                              {format(parseISO(incident.appointmentDate), 'h:mm a')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(incident.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {incident.cost ? `$${incident.cost}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleView(incident.id)}
                                className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded transition-colors duration-150"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleEdit(incident.id)}
                                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded transition-colors duration-150"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

         {/* Modals */}
         {detailsIncident && (
          <AppointmentDetailsModal
            incident={detailsIncident}
            patient={patients.find((p) => p.id === detailsIncident.patientId)}
            onClose={() => setDetailsIncident(null)}
          />
        )}
        {showNewModal && (
          <NewAppointmentModal
            patients={patients}
            onClose={() => setShowNewModal(false)}
            onSave={() => {
              setIncidents(storage.getIncidents());
              setShowNewModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;