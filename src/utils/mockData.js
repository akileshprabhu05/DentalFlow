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
    {
      id: '3',
      email: 'jane@entnt.in',
      password: 'patient123',
      role: 'Patient',
      patientId: 'p2',
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
    },
    {
      id: 'p2',
      name: 'Jane Smith',
      dob: '1985-08-22',
      contact: '9876543210',
      email: 'jane@entnt.in',
      address: '456 Oak Ave, City, State 12345',
      healthInfo: 'Allergic to penicillin. Diabetic - requires special care.',
      emergencyContact: 'Robert Smith - 5551234567',
      createdAt: '2024-02-01T10:30:00Z',
    },
    {
      id: 'p3',
      name: 'Michael Johnson',
      dob: '1978-12-03',
      contact: '5556667777',
      email: 'michael@example.com',
      address: '789 Pine Rd, City, State 12345',
      healthInfo: 'History of gum disease. Regular cleanings recommended.',
      emergencyContact: 'Sarah Johnson - 5558889999',
      createdAt: '2024-01-20T14:15:00Z',
    },
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
    },
    {
      id: 'i2',
      patientId: 'p1',
      title: 'Cavity Treatment',
      description: 'Small cavity in upper right molar',
      comments: 'Patient experienced some discomfort',
      appointmentDate: '2025-01-20T14:00:00Z',
      cost: 250,
      treatment: 'Composite filling',
      status: 'Scheduled',
      files: [],
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z',
    },
    {
      id: 'i3',
      patientId: 'p2',
      title: 'Crown Placement',
      description: 'Crown placement for damaged tooth',
      comments: 'Requires follow-up in 2 weeks',
      appointmentDate: '2025-01-18T09:00:00Z',
      cost: 800,
      treatment: 'Ceramic crown placement',
      status: 'In Progress',
      nextAppointmentDate: '2025-02-01T09:00:00Z',
      files: [],
      createdAt: '2024-11-20T08:00:00Z',
      updatedAt: '2025-01-18T10:00:00Z',
    },
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
  