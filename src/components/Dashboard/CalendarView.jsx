import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';

// Mock storage for demo purposes
const storage = {
  getIncidents: () => [
    {
      id: 1,
      title: 'Dental Checkup',
      patientId: 1,
      appointmentDate: '2024-06-15T10:00:00',
      treatment: 'Regular cleaning'
    },
    {
      id: 2,
      title: 'Root Canal',
      patientId: 2,
      appointmentDate: '2024-06-15T14:30:00',
      treatment: 'Endodontic treatment'
    },
    {
      id: 3,
      title: 'Consultation',
      patientId: 3,
      appointmentDate: '2024-06-20T09:15:00',
      treatment: 'Initial consultation'
    }
  ]
};

// Mock date-fns functions for demo
const format = (date, formatStr) => {
  const options = {
    'd': { day: 'numeric' },
    'MMMM yyyy': { month: 'long', year: 'numeric' },
    'PPP': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    'hh:mm a': { hour: '2-digit', minute: '2-digit', hour12: true }
  };
  return new Intl.DateTimeFormat('en-US', options[formatStr] || {}).format(date);
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};
const endOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
};
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};
const isSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};
const parseISO = (dateString) => new Date(dateString);

const CalendarView = ({ patients = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Johnson' }
] }) => {
  const [incidents, setIncidents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setIncidents(storage.getIncidents());
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = 'd';
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const dayIncidents = incidents.filter((incident) =>
        isSameDay(parseISO(incident.appointmentDate), day)
      );
      
      const isToday = isSameDay(day, new Date());
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      
      days.push(
        <div
          className={`
            relative p-3 h-28 cursor-pointer transition-all duration-200 ease-in-out
            border border-gray-100 hover:border-indigo-200 hover:shadow-sm
            ${!isCurrentMonth 
              ? 'bg-gray-50/50 text-gray-400' 
              : 'bg-white text-gray-900 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50'
            }
            ${isSelected 
              ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 shadow-md' 
              : ''
            }
            ${isToday && !isSelected 
              ? 'ring-2 ring-indigo-400 ring-opacity-50' 
              : ''
            }
            group
          `}
          key={day.toString()}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className={`
                text-sm font-semibold
                ${isToday ? 'text-indigo-600' : ''}
                ${isSelected ? 'text-indigo-700' : ''}
              `}>
                {formattedDate}
              </span>
              {isToday && (
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {dayIncidents.length > 0 && (
                <div className="space-y-1">
                  <div className={`
                    inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                    ${isSelected 
                      ? 'bg-indigo-200 text-indigo-800' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    }
                    shadow-sm
                  `}>
                    <Calendar className="w-3 h-3" />
                    <span>{dayIncidents.length}</span>
                  </div>
                  {dayIncidents.length <= 2 && (
                    <div className="space-y-0.5">
                      {dayIncidents.slice(0, 2).map((incident, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 truncate bg-white/70 px-1 rounded"
                        >
                          {incident.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-0" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const selectedDayIncidents = selectedDate
    ? incidents.filter((incident) =>
        isSameDay(parseISO(incident.appointmentDate), selectedDate)
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(addDays(monthStart, -1))}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium">Previous</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {format(currentMonth, 'MMMM yyyy')}
              </h1>
              <p className="text-gray-600 mt-1">Healthcare Calendar</p>
            </div>
            
            <button
              onClick={() => setCurrentMonth(addDays(monthEnd, 1))}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Week Headers */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-sm uppercase tracking-wide">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="divide-y divide-gray-100">
            {rows}
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {format(selectedDate, 'PPP')}
                </h3>
                <p className="text-gray-600">Scheduled Appointments</p>
              </div>
            </div>
            
            {selectedDayIncidents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No appointments scheduled for this day</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedDayIncidents.map((incident) => {
                  const patient = patients.find((p) => p.id === incident.patientId);
                  return (
                    <div
                      key={incident.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-lg text-gray-900 line-clamp-2">
                          {incident.title}
                        </h4>
                        <div className="p-2 bg-indigo-100 rounded-lg ml-3">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="font-medium">
                            {patient ? patient.name : 'Unknown Patient'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{format(parseISO(incident.appointmentDate), 'hh:mm a')}</span>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-700 font-medium">Treatment:</p>
                          <p className="text-sm text-gray-600 mt-1">{incident.treatment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;