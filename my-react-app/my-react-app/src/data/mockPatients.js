export const initialPatients = [
  { 
    id: 'P002', 
    type: 'Recipient', 
    bloodType: 'A+', 
    status: 'Waiting', 
    hospital: 'A',
    recordHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d'
  },
  { 
    id: 'P003', 
    type: 'Donor', 
    bloodType: 'B-', 
    status: 'Available', 
    hospital: 'A',
    recordHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b'
  },
  { 
    id: 'P004', 
    type: 'Recipient', 
    bloodType: 'AB+', 
    status: 'Matched', 
    hospital: 'B',
    recordHash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d'
  },
];

export const initialAuditLogs = [
  { 
    id: 'P001', 
    event: 'Created', 
    timestamp: '2024-11-20 10:30:00', 
    user: 'Dr. Smith',
    details: 'Patient record created on blockchain'
  },
  { 
    id: 'P001', 
    event: 'Updated', 
    timestamp: '2024-11-21 14:15:00', 
    user: 'Dr. Smith',
    details: 'Medical information updated'
  },
  { 
    id: 'P002', 
    event: 'Created', 
    timestamp: '2024-11-19 09:00:00', 
    user: 'Dr. Johnson',
    details: 'Patient record created on blockchain'
  },
  { 
    id: 'P002', 
    event: 'Allocation Decision', 
    timestamp: '2024-11-22 11:00:00', 
    user: 'Coordinator Lee',
    details: 'Matched with donor P001'
  },
  { 
    id: 'P003', 
    event: 'Created', 
    timestamp: '2024-11-18 16:45:00', 
    user: 'Dr. Smith',
    details: 'Patient record created on blockchain'
  },
];

export const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
export const patientTypes = ['Donor', 'Recipient'];