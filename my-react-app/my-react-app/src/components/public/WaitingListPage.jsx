import React, { useState, useEffect } from 'react';
import { List, ArrowLeft, Activity, User, Clock } from 'lucide-react';
import { api } from '../../utils/api';

const WaitingListPage = ({ onBack }) => {
  const [selectedOrgan, setSelectedOrgan] = useState('Kidney');
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas'];

  useEffect(() => {
    fetchList();
  }, [selectedOrgan]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await api.getPublicWaitingList(selectedOrgan);
      setWaitingList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>
          <div className="flex items-center gap-2 text-blue-700">
             <Activity className="w-6 h-6" />
             <h1 className="text-2xl font-bold">Public Organ Waiting List</h1>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
           <div>
              <h2 className="text-lg font-semibold text-gray-800">Live Rankings</h2>
              <p className="text-sm text-gray-500">Real-time data from Blockchain Ledger</p>
           </div>
           
           <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">Select Organ:</span>
              <select 
                value={selectedOrgan} 
                onChange={(e) => setSelectedOrgan(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              >
                {organs.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
           </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Patient ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Blood Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Age</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Urgency</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Wait Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading live data...</td></tr>
                ) : waitingList.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No patients waiting for {selectedOrgan}</td></tr>
                ) : (
                  waitingList.map((patient, index) => (
                    <tr key={patient.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-700 font-medium">{patient.id}</td>
                      <td className="px-6 py-4 text-gray-600 font-semibold">{patient.bloodType}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.age} yrs</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(patient.urgency)}`}>
                          {patient.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          Waiting
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
            Powered by Hyperledger Fabric • Immutable & Transparent
        </div>
      </div>
    </div>
  );
};

export default WaitingListPage;