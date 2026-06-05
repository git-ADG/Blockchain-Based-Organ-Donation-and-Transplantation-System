import { useState, useCallback } from 'react';
import { initialPatients } from '../data/mockPatients';
import { generateRecordHash } from '../utils/helpers';

export const usePatients = () => {
  const [patients, setPatients] = useState(initialPatients);

  const addPatient = useCallback((patientData) => {
    const newPatient = {
      ...patientData,
      recordHash: patientData.recordHash || generateRecordHash(),
      status: patientData.type === 'Donor' ? 'Available' : 'Waiting',
      hospital: patientData.hospital || 'A',
    };
    
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  }, []);

  const updatePatient = useCallback((patientId, updates) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, ...updates }
          : patient
      )
    );
  }, []);

  const getPatientById = useCallback((patientId) => {
    return patients.find(patient => patient.id === patientId);
  }, [patients]);

  const getPatientsByHospital = useCallback((hospital) => {
    return patients.filter(patient => patient.hospital === hospital);
  }, [patients]);

  return {
    patients,
    addPatient,
    updatePatient,
    getPatientById,
    getPatientsByHospital,
  };
};