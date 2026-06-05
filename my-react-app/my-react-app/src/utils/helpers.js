export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generatePatientId = (existingPatients) => {
  const maxId = existingPatients.reduce((max, patient) => {
    const num = parseInt(patient.id.replace('P', ''));
    return num > max ? num : max;
  }, 0);
  return `P${String(maxId + 1).padStart(3, '0')}`;
};

export const generateRecordHash = () => {
  const characters = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 32; i++) {
    hash += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return hash;
};

export const filterPatientsByHospital = (patients, hospital) => {
  return patients.filter(patient => patient.hospital === hospital);
};

export const getStatusColor = (status) => {
  const colors = {
    'Available': 'bg-green-100 text-green-800',
    'Waiting': 'bg-yellow-100 text-yellow-800',
    'Matched': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const validatePatientData = (data) => {
  const errors = {};
  
  if (!data.id || data.id.trim() === '') {
    errors.id = 'Patient ID is required';
  }
  
  if (!data.bloodType) {
    errors.bloodType = 'Blood type is required';
  }
  
  if (!data.type) {
    errors.type = 'Patient type is required';
  }
  
  if (!data.recordHash || data.recordHash.trim() === '') {
    errors.recordHash = 'Medical record hash is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};