import React, { useEffect } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setPatients } from '../../store/slices/patientsSlice';
import { setIncidents } from '../../store/slices/incidentsSlice';
import { storage } from '../../utils/storage';
import StatsCard from './StatsCard';
import RecentAppointments from './RecentAppointments';
import RevenueChart from './RevenueChart';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector((state) => state.patients);
  const { incidents } = useAppSelector((state) => state.incidents);

  useEffect(() => {
    const loadedPatients = storage.getPatients();
    const loadedIncidents = storage.getIncidents();
    dispatch(setPatients(loadedPatients));
    dispatch(setIncidents(loadedIncidents));
  }, [dispatch]);

  const completedIncidents = incidents.filter((i) => i.status === 'Completed');
  const upcomingIncidents = incidents.filter(
    (i) => i.status === 'Scheduled' && new Date(i.appointmentDate) > new Date()
  );
  const totalRevenue = completedIncidents.reduce(
    (sum, incident) => sum + (incident.cost || 0),
    0
  );
  const pendingIncidents = incidents.filter(
    (i) => i.status === 'In Progress'
  ).length;

  const statsData = [
    {
      title: 'Total Patients',
      value: patients.length.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingIncidents.length.toString(),
      change: '+5%',
      changeType: 'positive',
      icon: Calendar,
      color: 'green',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Pending Treatments',
      value: pendingIncidents.toString(),
      change: '-2%',
      changeType: 'negative',
      icon: Clock,
      color: 'orange',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to DentalCare Dashboard</h1>
        <p className="text-blue-100">
          Manage your patients, appointments, and practice efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <RevenueChart incidents={completedIncidents} />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {incidents.slice(0, 5).map((incident) => {
              const patient = patients.find((p) => p.id === incident.patientId);
              return (
                <div key={incident.id} className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      incident.status === 'Completed'
                        ? 'bg-green-500'
                        : incident.status === 'In Progress'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {incident.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient?.name} • {incident.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Appointments</h2>
        <RecentAppointments
          incidents={upcomingIncidents.slice(0, 5)}
          patients={patients}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
