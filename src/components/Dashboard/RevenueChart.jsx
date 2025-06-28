import React from 'react';

const RevenueChart = ({ incidents }) => {
  const monthlyRevenue = incidents.reduce((acc, incident) => {
    if (incident.cost) {
      const date = new Date(incident.appointmentDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + incident.cost;
    }
    return acc;
  }, {});

  const months = Object.keys(monthlyRevenue).sort();
  const revenues = months.map((month) => monthlyRevenue[month]);
  const maxRevenue = Math.max(...revenues, 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 bg-gray-50 rounded-lg p-4">
        {months.map((month, index) => {
          const height = (revenues[index] / maxRevenue) * 200;
          return (
            <div key={month} className="flex flex-col items-center">
              <div
                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md w-8 transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                style={{ height: `${height}px` }}
              />
              <div className="text-xs text-gray-600 mt-2">
                {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            ${revenues.reduce((sum, rev) => sum + rev, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            ${Math.round(revenues.reduce((sum, rev) => sum + rev, 0) / revenues.length || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Avg Monthly</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
          <p className="text-sm text-gray-500">Treatments</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
