import React, { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import CoordinatorPage from './components/coordinator/CoordinatorPage';
import AuditorPage from './components/auditor/AuditorPage';
import WaitingListPage from './components/public/WaitingListPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentPage(role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin} 
          onViewWaitingList={() => setCurrentPage('public')}
        />
      )}

      {currentPage === 'public' && (
        <WaitingListPage onBack={() => setCurrentPage('login')} />
      )}
      
      {currentPage === 'doctor' && (
        <DoctorDashboard 
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'coordinator' && (
        <CoordinatorPage onLogout={handleLogout} />
      )}
      
      {currentPage === 'auditor' && (
        <AuditorPage 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;