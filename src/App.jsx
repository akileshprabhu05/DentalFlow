import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { initializeAuth } from './store/slices/authSlice';
import { initializeMockData } from './utils/mockData';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PatientList from './components/Patients/PatientList';
import CalendarView from './components/Calendar/CalendarView';
import IncidentList from './components/Appointments/AppointmentList';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import MyAppointments from './components/Patients/MyAppointments';
import MyRecords from './components/Patients/MyRecords';


const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    dispatch(initializeAuth());
    setAuthInitialized(true);
  }, [dispatch]);

  if (!authInitialized) return null;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        {user?.role === 'Admin' ? (
          <>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route
              path="/appointments"
              element={<IncidentList />}
            />
            <Route
              path="/calendar"
              element={<CalendarView patients={store.getState().patients.patients} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/patient-dashboard" element={<PatientDashboard/>} />
            <Route path="/my-appointments" element={<MyAppointments/>} />
            <Route path="/my-records" element={<MyRecords/>} />
            <Route path="*" element={<Navigate to="/patient-dashboard" replace />} />
          </>
        )}
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
