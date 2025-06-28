export const mockUsers = [
    {
      id: '1',
      email: 'admin@entnt.in',
      password: 'admin123',
      role: 'Admin',
    },
    {
      id: '2',
      email: 'john@entnt.in',
      password: 'patient123',
      role: 'Patient',
      patientId: 'p1',
    },
  ];
  
  // Mock patient data
  export const mockPatients = [
    {
      id: 'p1',
      name: 'John Doe',
      dob: '1990-05-10',
      contact: '1234567890',
      email: 'john@entnt.in',
      address: '123 Main St, City, State 12345',
      healthInfo: 'No known allergies. Previous dental work: root canal in 2020.',
      emergencyContact: 'Jane Doe - 0987654321',
      createdAt: '2024-01-15T09:00:00Z',
    }
  ];
  
  // Mock incident data
  export const mockIncidents = [
    {
      id: 'i1',
      patientId: 'p1',
      title: 'Routine Cleaning',
      description: 'Regular dental cleaning and checkup',
      comments: 'Patient reported mild sensitivity to cold',
      appointmentDate: '2025-01-15T10:00:00Z',
      cost: 120,
      treatment: 'Professional cleaning, fluoride treatment',
      status: 'Completed',
      nextAppointmentDate: '2025-07-15T10:00:00Z',
      files: [],
      createdAt: '2024-12-01T09:00:00Z',
      updatedAt: '2025-01-15T11:00:00Z',
    }
  ];
  
  
  export const initializeMockData = () => {
    if (!localStorage.getItem('dentalUsers')) {
      localStorage.setItem('dentalUsers', JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem('dentalPatients')) {
      localStorage.setItem('dentalPatients', JSON.stringify(mockPatients));
    }
    if (!localStorage.getItem('dentalIncidents')) {
      localStorage.setItem('dentalIncidents', JSON.stringify(mockIncidents));
    }
  };
  