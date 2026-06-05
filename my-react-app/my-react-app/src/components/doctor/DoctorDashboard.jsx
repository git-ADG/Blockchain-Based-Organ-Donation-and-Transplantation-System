import React, { useState, useEffect } from 'react';
import { User, RefreshCw } from 'lucide-react';
import PageLayout from '../layout/PageLayout';
import SecurityBanner from '../shared/SecurityBanner';
import PatientList from './PatientList';
import PatientDetailsModal from './PatientDetailsModal';
import Button from '../shared/Button';
import RegistrationForm from '../registration/RegistrationForm';
import { api } from '../../utils/api';

const DoctorDashboard = ({ onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
        const data = await api.getPatients();
        setPatients(Array.isArray(data) ? data : []); 
    } catch (err) {
        console.error("Failed to fetch patients:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
      fetchPatients();
  };

  return (
    <PageLayout 
      title="Hospital Blockchain System"
      onLogout={onLogout}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome, Doctor</h2>
          <p className="text-gray-600 mt-1">Hospital A - Medical Staff</p>
        </div>
        <div className="flex gap-3">
            <Button onClick={fetchPatients} variant="secondary" icon={RefreshCw}>
                Refresh
            </Button>
            <Button
              onClick={() => setShowRegistration(true)}
              variant="primary"
              icon={User}
            >
              Register New Patient
            </Button>
        </div>
      </div>

      <div className="mb-6">
        <SecurityBanner 
          type="silo"
          message="Data Silo: Viewing real-time ledger data for Hospital A"
          variant="info"
        />
      </div>

      {loading ? (
          <div className="text-center py-10 text-gray-500">Loading blockchain records...</div>
      ) : (
          <PatientList 
            patients={patients}
            onSelectPatient={setSelectedPatient}
          />
      )}

      {selectedPatient && (
        <PatientDetailsModal 
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {showRegistration && (
        <RegistrationForm 
          onClose={() => setShowRegistration(false)}
          onSubmit={handleRegistrationSuccess}
        />
      )}
    </PageLayout>
  );
};

export default DoctorDashboard;