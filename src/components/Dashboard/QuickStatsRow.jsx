import React from 'react';

const QuickStatsRow = ({ todayAppointments, pendingTreatments, completedMonth, cancelledToday }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-blue-700">{todayAppointments}</div>
        <div className="text-sm text-gray-700">Today: Appointments</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-yellow-700">{pendingTreatments}</div>
        <div className="text-sm text-gray-700">Pending: Treatments</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-green-700">{completedMonth}</div>
        <div className="text-sm text-gray-700">Completed (Month)</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center">
        <div className="text-2xl font-bold text-red-700">{cancelledToday}</div>
        <div className="text-sm text-gray-700">Cancelled (Today)</div>
      </div>
    </div>
  );
};

export default QuickStatsRow;
