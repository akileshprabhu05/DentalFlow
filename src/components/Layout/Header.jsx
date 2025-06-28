import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/60 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-600">Online</span>
            </div>
            
            <div className="border-l border-slate-200 pl-3 hidden sm:block"></div>
            
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {user?.role === 'Admin' ? 'Admin Dashboard' : 'Patient Portal'}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Welcome back, <span className="text-slate-700 font-semibold">{user?.email?.split('@')[0]}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="pl-10 pr-4 py-2.5 w-64 border border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all duration-200 text-sm placeholder-slate-400 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2 border-l border-slate-200 pl-3">
            <div className="text-xs text-slate-500">
              <div className="font-semibold text-slate-700">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div>{new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</div>
            </div>
          </div>

          <div className="relative">
            <button className="group p-3 text-slate-400 hover:text-slate-600 relative bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
              <Bell className="h-5 w-5 group-hover:animate-pulse" />
              
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                <span className="h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  3
                </span>
              </div>
              
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-400 rounded-full animate-ping opacity-20"></div>
            </button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="text-xs text-slate-600">
                <div className="font-semibold mb-1">Recent Notifications</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>3 new appointments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>2 pending approvals</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
            </div>
          </div>

          <button className="md:hidden p-3 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    </header>
  );
};

export default Header;