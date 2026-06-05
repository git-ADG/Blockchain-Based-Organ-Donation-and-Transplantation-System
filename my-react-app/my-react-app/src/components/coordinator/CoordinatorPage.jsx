import React, { useState, useEffect, useMemo } from 'react';
import { Shield, AlertCircle, RefreshCw, UserCheck, Filter, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import PageLayout from '../layout/PageLayout';
import { api } from '../../utils/api';

const isBloodCompatible = (donorBlood, recipientBlood) => {
    const rules = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    };
    return rules[donorBlood]?.includes(recipientBlood) || false;
};

const CoordinatorPage = ({ onLogout }) => {
  const [donorId, setDonorId] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  
  const [filterOrgan, setFilterOrgan] = useState('Kidney');
  const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas'];

  useEffect(() => {
    fetchDashboardData();
  }, [filterOrgan]);

  const fetchDashboardData = async () => {
    try {
        const d = await api.getAvailableDonors();
        setDonors(d.data);
        
        const r = await api.getPublicWaitingList(filterOrgan); 
        setRecipients(r.data);
    } catch (err) {
        console.error("Failed to load dashboard data");
    }
  };

  const handleAllocation = async () => {
    if (!donorId || !recipientId) return;
    
    try {
      const res = await api.allocateOrgan(donorId, recipientId);
      setStatusMsg({ type: 'success', text: `Success! TxID: ${res.txId.substring(0, 15)}...` });
      
      setDonorId('');
      setRecipientId('');
      fetchDashboardData();

      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const filteredDonors = donors.filter(d => d.organ === filterOrgan);

  const recommendation = useMemo(() => {
    if (!filteredDonors.length || !recipients.length) return null;

    let bestMatch = null;
    let highestScore = -1;

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        
        for (const donor of filteredDonors) {
            if (isBloodCompatible(donor.bloodType, recipient.bloodType)) {
                let score = 0;
                
                score += (recipients.length - i) * 10;

                if (donor.bloodType === recipient.bloodType) {
                    score += 50; 
                } else {
                    score += 20; 
                }

                const ageDiff = Math.abs((donor.age || 30) - (recipient.age || 30));
                if (ageDiff <= 10) score += 30;
                else if (ageDiff <= 20) score += 15;

                if (score > highestScore) {
                    highestScore = score;
                    
                    let matchQuality = donor.bloodType === recipient.bloodType ? "Exact Blood Match" : "Compatible Blood";
                    let urgencyText = recipient.urgency === "Critical" ? "Critical Priority" : "Standard Priority";
                    
                    bestMatch = {
                        donor,
                        recipient,
                        reason: `${matchQuality} • ${urgencyText} • Age Gap: ${ageDiff} yrs`
                    };
                }
            }
        }
    }
    return bestMatch;
  }, [filteredDonors, recipients]);

  const handleAcceptRecommendation = () => {
      if (recommendation) {
          setDonorId(recommendation.donor.id);
          setRecipientId(recommendation.recipient.id);
      }
  };

  return (
    <PageLayout onLogout={onLogout}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10" />
            <div>
              <h2 className="text-3xl font-bold">Coordinator Dashboard</h2>
              <p className="text-purple-100 mt-1">Authorized for Organ Allocation & Matching</p>
            </div>
          </div>
        </div>

        {/* Global Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between border border-gray-100">
           <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Active Filter:</span>
              <span className="text-purple-600 font-bold">{filterOrgan} Matching</span>
           </div>
           <div className="flex items-center gap-4">
              <label className="text-sm text-gray-500">Select Organ Context:</label>
              <select 
                  value={filterOrgan} 
                  onChange={(e) => setFilterOrgan(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 font-medium"
              >
                  {organs.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <button onClick={fetchDashboardData} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition">
                  <RefreshCw className="w-5 h-5"/>
              </button>
           </div>
        </div>

        {/* 2-Column Layout for Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Donors Table */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-green-600" />
                        Available {filterOrgan} Donors
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{filteredDonors.length} Found</span>
                </div>
                <div className="overflow-y-auto max-h-60">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Blood</th>
                                <th className="p-2 text-left">Age</th>
                                <th className="p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonors.map(d => (
                                <tr key={d.id} className={`border-t hover:bg-green-50 transition ${donorId === d.id ? 'bg-green-100' : ''}`}>
                                    <td className="p-2 font-medium">{d.id}</td>
                                    <td className="p-2 font-bold text-gray-600">{d.bloodType}</td>
                                    <td className="p-2">{d.age} yrs</td>
                                    <td className="p-2">
                                        <button onClick={() => setDonorId(d.id)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium">Select</button>
                                    </td>
                                </tr>
                            ))}
                             {filteredDonors.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400 italic">No donors available for {filterOrgan}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Waiting List Table */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        {filterOrgan} Waiting List
                    </h3>
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">{recipients.length} Waiting</span>
                </div>
                <div className="overflow-y-auto max-h-60">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 text-left">Rank</th>
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Urg</th>
                                <th className="p-2 text-left">Blood</th>
                                <th className="p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipients.map((r, i) => (
                                <tr key={r.id} className={`border-t hover:bg-red-50 transition ${recipientId === r.id ? 'bg-red-100' : ''}`}>
                                    <td className="p-2"><span className="bg-gray-800 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{i + 1}</span></td>
                                    <td className="p-2 font-medium">{r.id}</td>
                                    <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${r.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{r.urgency}</span></td>
                                    <td className="p-2 font-bold text-gray-600">{r.bloodType}</td>
                                    <td className="p-2">
                                        <button onClick={() => setRecipientId(r.id)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-medium">Select</button>
                                    </td>
                                </tr>
                            ))}
                             {recipients.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">No patients waiting for {filterOrgan}</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* --- RECOMMENDED ALLOCATION ENGINE --- */}
        {recommendation ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeIn">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">Algorithmic Recommendation</h4>
                        <div className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-1">
                            <span>Donor {recommendation.donor.id}</span>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                            <span>Recipient {recommendation.recipient.id}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{recommendation.reason}</p>
                    </div>
                </div>
                <button 
                    onClick={handleAcceptRecommendation}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md whitespace-nowrap"
                >
                    <CheckCircle className="w-5 h-5" />
                    Quick Select Pair
                </button>
            </div>
        ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 mb-8 text-center text-gray-500">
                <Sparkles className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                No suitable algorithmic matches found for {filterOrgan}. Manual selection required.
            </div>
        )}

        {/* Execution Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Execute Allocation</h3>
          
          {statusMsg.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              <Shield className="w-5 h-5" />
              <p className="font-medium">{statusMsg.text}</p>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Donor ID</label>
              <input type="text" value={donorId} onChange={(e) => setDonorId(e.target.value)}
                placeholder="Select from Donors list"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-green-50 font-mono text-green-800 font-bold" />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Recipient ID</label>
              <input type="text" value={recipientId} onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Select from Waiting List"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none bg-red-50 font-mono text-red-800 font-bold" />
            </div>

            <button onClick={handleAllocation} disabled={!donorId || !recipientId}
              className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition disabled:bg-gray-300 disabled:cursor-not-allowed h-[50px] shadow-lg">
              Log Allocation on Chain
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CoordinatorPage;