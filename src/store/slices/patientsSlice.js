import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  loading: false,
  selectedPatient: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    deletePatient: (state, action) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
  },
});

export const {
  setLoading,
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setSelectedPatient,
} = patientsSlice.actions;

export default patientsSlice.reducer;
