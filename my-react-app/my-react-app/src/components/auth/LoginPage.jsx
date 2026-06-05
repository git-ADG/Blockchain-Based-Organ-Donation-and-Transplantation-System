import React, { useState } from 'react';
import { Shield, Lock, List } from 'lucide-react';
import { api } from '../../utils/api';

const LoginPage = ({ onLogin, onViewWaitingList }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      const data = await api.login(username, password);
      
      localStorage.setItem('token', data.token);
      
      let frontendRole = 'doctor';
      if(data.user?.role === 'Transplant_Coordinator') frontendRole = 'coordinator';
      if(data.user?.role === 'Auditor') frontendRole = 'auditor';

      onLogin(frontendRole);
    } catch (err) {
      setError('Invalid credentials or server error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Hospital Blockchain Security
        </h1>
        <p className="text-gray-600 text-center mb-8">Secure Access Portal</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">Access controls enforced via RBAC</p>
          </div>
          
          <div className="space-y-2 pt-2">
            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
               Login to System
            </button>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">Public Access</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button onClick={onViewWaitingList} className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
               <List className="w-5 h-5" />
               View Waiting List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;