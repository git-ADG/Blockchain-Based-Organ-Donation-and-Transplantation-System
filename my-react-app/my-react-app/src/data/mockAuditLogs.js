export const initialAuditLogs = [
  { 
    id: 'P001', 
    event: 'Updated', 
    timestamp: '2025-11-25 14:15:00', 
    user: 'Dr. Smith (Hosp A)',
    details: 'HLA typing and viral marker results uploaded.'
  },
  { 
    id: 'P001', 
    event: 'Updated', 
    timestamp: '2025-11-26 09:00:00', 
    user: 'Dr. Smith (Hosp A)',
    details: 'Status changed to: Available'
  },

  { 
    id: 'P002', 
    event: 'Created', 
    timestamp: '2025-11-26 10:00:00', 
    user: 'Dr. Johnson (Hosp A)',
    details: 'Recipient record created. Urgency: High.'
  },
  { 
    id: 'P002', 
    event: 'Updated', 
    timestamp: '2025-11-27 11:20:00', 
    user: 'Dr. Johnson (Hosp A)',
    details: 'MELD Score updated to 28. Status: Waiting.'
  },

  { 
    id: 'P004', 
    event: 'Created', 
    timestamp: '2025-11-26 16:45:00', 
    user: 'Dr. Williams (Hosp B)',
    details: 'Recipient record created at Hospital B.'
  },
  { 
    id: 'P004', 
    event: 'Updated', 
    timestamp: '2025-11-27 08:30:00', 
    user: 'Dr. Williams (Hosp B)',
    details: 'Cross-match request initiated with national registry.'
  },

  { 
    id: 'P001', 
    event: 'Allocation Decision', 
    timestamp: '2025-11-28 09:15:00', 
    user: 'Coordinator Lee',
    details: 'Organ allocated to Recipient P004 (Hospital B) via Smart Contract.'
  },
  { 
    id: 'P004', 
    event: 'Allocation Decision', 
    timestamp: '2025-11-28 09:15:00', 
    user: 'Coordinator Lee',
    details: 'Matched with Donor P001. Transport logistics initiated.'
  },

  { 
    id: 'P003', 
    event: 'Created', 
    timestamp: '2025-11-28 12:00:00', 
    user: 'Dr. Smith (Hosp A)',
    details: 'New Donor registered. Awaiting medical clearance.'
  },
  { 
    id: 'P004', 
    event: 'Procedure Completed', 
    timestamp: '2025-11-28 18:30:00', 
    user: 'Dr. Williams (Hosp B)',
    details: 'Transplant surgery successful. Recovery phase started.'
  },
];