import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  User,
  LogOut,
  Stethoscope,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const adminNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  const patientNavItems = [
    { path: '/patient-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-appointments', icon: Calendar, label: 'My Appointments' },
    { path: '/my-records', icon: FileText, label: 'Medical Records' },
  ];

  const navItems = user?.role === 'Admin' ? adminNavItems : patientNavItems;

  return (
    <div className="h-full bg-gradient-to-b from-slate-50 to-white shadow-2xl flex flex-col border-r border-slate-200/60">
      <div className="p-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              DentalCare
            </h1>
            <p className="text-sm text-slate-500 font-medium">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
            {user?.role === 'Admin' ? 'Administration' : 'Patient Portal'}
          </p>
        </div>
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 shadow-lg shadow-blue-100/50 border border-blue-100'
                  : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-50/30 hover:text-slate-900 hover:shadow-md'
              }`
            }
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              ({ isActive }) => isActive 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600'
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">{item.label}</span>
            <div className={`ml-auto w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              ({ isActive }) => isActive ? 'bg-blue-500' : 'bg-transparent'
            }`}></div>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/50 to-white/80 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-slate-100/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
                <User className="h-5 w-5 text-slate-600" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.email}
              </p>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  user?.role === 'Admin' ? 'bg-purple-400' : 'bg-blue-400'
                }`}></div>
                <p className="text-xs text-slate-500 font-medium">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center justify-center space-x-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-100/80 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] border border-red-100/50 hover:border-red-200"
        >
          <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;