import React, { useEffect } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setPatients } from '../../store/slices/patientsSlice';
import { setIncidents } from '../../store/slices/incidentsSlice';
import { storage } from '../../utils/storage';
import StatsCard from './StatsCard';
import RecentAppointments from './RecentAppointments';
import RevenueChart from './RevenueChart';
import { useDispatch, useSelector } from 'react-redux';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patients);
  const { incidents } = useSelector((state) => state.incidents);

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

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <span className="text-blue-100 font-medium">{currentDate}</span>
                </div>
                <h1 className="text-4xl font-bold mb-2 leading-tight">
                  Welcome to DentalCare
                  <span className="block text-3xl text-blue-100">Admin Dashboard</span>
                </h1>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Monitor your practice performance, manage patient care, and track appointments all in one centralized hub
                </p>
                
                <div className="flex items-center space-x-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-100 text-sm">System Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-blue-200" />
                    <span className="text-blue-100 text-sm">Real-time Analytics</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{patients.length}</div>
                    <div className="text-blue-100 text-sm">Active Patients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-white/50"
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Revenue Overview</h2>
                  <p className="text-slate-600">Track your practice's financial performance</p>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-semibold">+18% Growth</span>
                </div>
              </div>
              <div className="relative">
                <RevenueChart incidents={completedIncidents} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Recent Activity</h2>
                <p className="text-slate-600 text-sm">Latest practice updates</p>
              </div>
              <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-5">
              {incidents.slice(0, 5).map((incident, index) => {
                const patient = patients.find((p) => p.id === incident.patientId);
                return (
                  <div key={incident.id} className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200">
                    <div className="relative">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 shadow-sm ${
                          incident.status === 'Completed'
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : incident.status === 'In Progress'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}
                      />
                      {index !== 4 && (
                        <div className="absolute top-5 left-1/2 w-px h-8 bg-slate-200 transform -translate-x-1/2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {incident.title}
                        </p>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        <span className="font-medium">{patient?.name}</span> • 
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          incident.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : incident.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {incident.status}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {incidents.length > 5 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  View All Activities →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Recent Appointments</h2>
              <p className="text-slate-600">Manage upcoming patient visits</p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-blue-700 font-semibold">{upcomingIncidents.length} Upcoming</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl p-1">
            <div className="bg-white rounded-lg">
              <RecentAppointments
                incidents={upcomingIncidents.slice(0, 5)}
                patients={patients}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;