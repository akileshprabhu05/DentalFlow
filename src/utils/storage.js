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
  
    // Incidents
    getIncidents: () => {
      const incidents = localStorage.getItem('dentalIncidents');
      return incidents ? JSON.parse(incidents) : [];
    },
  
    saveIncidents: (incidents) => {
      localStorage.setItem('dentalIncidents', JSON.stringify(incidents));
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
  };
  