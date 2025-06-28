import { mockIncidents } from "./mockData";

export const storage = {
    // Users
    getUsers: () => {
      const users = localStorage.getItem('dentalUsers');
      return users ? JSON.parse(users) : [];
    },
  
    // Patients
    getPatients: () => {
      const patients = localStorage.getItem('dentalPatients');
      return patients ? JSON.parse(patients) : [];
    },
  
    savePatients: (patients) => {
      localStorage.setItem('dentalPatients', JSON.stringify(patients));
    },
  
  
    // File handling
    saveFile: async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
    },

    getIncidents: () => {
      try {
        const incidents = localStorage.getItem('dentalIncidents');
        return incidents ? JSON.parse(incidents) : mockIncidents;
      } catch (error) {
        console.error('Error loading incidents:', error);
        return mockIncidents;
      }
    },
  
    saveIncidents: (incidents) => {
      try {
        localStorage.setItem('dentalIncidents', JSON.stringify(incidents));
      } catch (error) {
        console.error('Error saving incidents:', error);
      }
    },
  
    addIncident: (incident) => {
      try {
        const incidents = storage.getIncidents();
        const newIncident = {
          ...incident,
          id: `i${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        incidents.push(newIncident);
        storage.saveIncidents(incidents);
        return newIncident;
      } catch (error) {
        console.error('Error adding incident:', error);
        throw error;
      }
    },
  
    updateIncident: (incident) => {
      try {
        const incidents = storage.getIncidents();
        const index = incidents.findIndex(i => i.id === incident.id);
        if (index !== -1) {
          incidents[index] = {
            ...incident,
            updatedAt: new Date().toISOString(),
          };
          storage.saveIncidents(incidents);
          return incidents[index];
        }
        throw new Error('Incident not found');
      } catch (error) {
        console.error('Error updating incident:', error);
        throw error;
      }
    },
  
    deleteIncident: (incidentId) => {
      try {
        const incidents = storage.getIncidents();
        const filteredIncidents = incidents.filter(i => i.id !== incidentId);
        storage.saveIncidents(filteredIncidents);
        return filteredIncidents;
      } catch (error) {
        console.error('Error deleting incident:', error);
        throw error;
      }
    },
  
    getIncidentsByPatient: (patientId) => {
      try {
        const incidents = storage.getIncidents();
        return incidents.filter(incident => incident.patientId === patientId);
      } catch (error) {
        console.error('Error getting incidents by patient:', error);
        return [];
      }
    },
  };
  