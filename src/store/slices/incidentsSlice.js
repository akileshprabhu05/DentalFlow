import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  incidents: [],
  loading: false,
  selectedIncident: null,
};

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setIncidents: (state, action) => {
      state.incidents = action.payload;
    },
    addIncident: (state, action) => {
      state.incidents.push(action.payload);
    },
    updateIncident: (state, action) => {
      const index = state.incidents.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.incidents[index] = action.payload;
      }
    },
    deleteIncident: (state, action) => {
      state.incidents = state.incidents.filter(i => i.id !== action.payload);
    },
    setSelectedIncident: (state, action) => {
      state.selectedIncident = action.payload;
    },
  },
});

export const {
  setLoading,
  setIncidents,
  addIncident,
  updateIncident,
  deleteIncident,
  setSelectedIncident,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
