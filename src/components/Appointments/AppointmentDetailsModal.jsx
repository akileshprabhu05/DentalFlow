import React from 'react';
import { format, parseISO } from 'date-fns';

const statusColors = {
  Scheduled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  'No Show': 'bg-gray-50 text-gray-700 border-gray-200',
  Rescheduled: 'bg-orange-50 text-orange-700 border-orange-200',
};

const AppointmentDetailsModal = ({ incident, patient, onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">Appointment Details</h2>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full opacity-70"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            <div className="w-2 h-2 bg-white rounded-full opacity-30"></div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-8 space-y-8">
            {/* Patient Info */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Patient Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Full Name</span>
                    <span className="text-gray-900 font-medium">{patient?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Contact Number</span>
                    <span className="text-gray-900">{patient?.contact || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Email Address</span>
                    <span className="text-gray-900">{patient?.email || '-'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Health Information</span>
                    <span className="text-gray-900">{patient?.healthInfo || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Emergency Contact</span>
                    <span className="text-gray-900">{patient?.emergencyContact || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Appointment Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Date & Time</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-900 font-medium">{format(parseISO(incident.appointmentDate), 'PPP p')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-2">Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border w-fit ${statusColors[incident.status] || 'bg-gray-100 text-gray-800'}`}>
                      <div className="w-2 h-2 rounded-full bg-current opacity-60 mr-2"></div>
                      {incident.status}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Treatment</span>
                    <span className="text-gray-900">{incident.treatment || '-'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Cost</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="text-gray-900 font-semibold text-lg">{incident.cost ? `₹${incident.cost}` : '-'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Next Appointment</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h8a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-900">{incident.nextAppointmentDate ? format(parseISO(incident.nextAppointmentDate), 'PPP p') : '-'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-500 mb-1">Comments</span>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <span className="text-gray-900 text-sm">{incident.comments || 'No comments'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Files Section */}
            {incident.files && incident.files.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">File Attachments</h3>
                  <span className="ml-auto bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm font-medium">
                    {incident.files.length} file{incident.files.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {incident.files.map((file, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 truncate">{file.name}</h4>
                            <div className="text-xs text-gray-500 mt-1 space-x-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">{file.type}</span>
                              <span>•</span>
                              <span>{Math.round(file.size / 1024)} KB</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Uploaded: {format(parseISO(file.uploadedAt), 'PPP p')}
                            </div>
                          </div>
                        </div>
                        <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
    </div>
  );
};

export default AppointmentDetailsModal;
