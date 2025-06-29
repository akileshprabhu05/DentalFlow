import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const RecentAppointments = ({ incidents, patients }) => {
  if (incidents.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No upcoming appointments</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => {
        const patient = patients.find(p => p.id === incident.patientId);
        const appointmentDate = new Date(incident.appointmentDate);
        
        return (
          <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{patient?.name}</h3>
                <p className="text-sm text-gray-600">{incident.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                {format(appointmentDate, 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {format(appointmentDate, 'hh:mm a')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentAppointments;
