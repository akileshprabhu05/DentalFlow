import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientsReducer from './slices/patientsSlice';
import incidentsReducer from './slices/incidentsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    incidents: incidentsReducer,
  },
});
