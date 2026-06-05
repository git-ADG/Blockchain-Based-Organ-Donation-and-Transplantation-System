const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  login: async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  getPatients: async () => {
    const response = await fetch(`${BASE_URL}/donors/all`, { 
        method: 'GET',
        headers: getHeaders() 
    });
    return response.json();
  },

  getPublicWaitingList: async (organ) => {
    const response = await fetch(`${BASE_URL}/public/waiting-list/${organ}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  getAvailableDonors: async () => {
    const response = await fetch(`${BASE_URL}/public/donors/available`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  getAuditHistory: async (patientId) => {
    const response = await fetch(`${BASE_URL}/audit/history/${patientId}`, {
        method: 'GET',
        headers: getHeaders()
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch history');
    }
    return response.json();
  },

  registerPatient: async (patientData) => {
    const payload = {
      id: patientData.id,
      firstName: patientData.firstName || "Unknown",
      lastName: patientData.lastName || "Patient",
      bloodType: patientData.bloodType,
      organ: patientData.organ,
      age: patientData.age,
      urgency: patientData.urgency,
      type: patientData.type,
      medicalNotes: patientData.recordHash || "Initial Record"
    };

    const response = await fetch(`${BASE_URL}/donors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Registration failed');
    }
    return response.json();
  },

  allocateOrgan: async (donorId, recipientId) => {
      const response = await fetch(`${BASE_URL}/donors/allocate`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ donorId, recipientId })
      });
      if(!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Allocation failed");
      }
      return response.json();
  }
};