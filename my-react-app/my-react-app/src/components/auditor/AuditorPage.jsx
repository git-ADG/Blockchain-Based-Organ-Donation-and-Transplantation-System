import React, { useState } from 'react';
import { Search, FileText, Database, AlertCircle } from 'lucide-react';
import PageLayout from '../layout/PageLayout';
import AuditLogCard from './AuditLogCard';
import { api } from '../../utils/api';

const AuditorPage = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError('');
    setSearchPerformed(true);
    setLogs([]);

    try {
        const res = await api.getAuditHistory(searchQuery);
        
        const formattedLogs = res.data.map(item => ({
            id: searchQuery,
            event: item.Value.status || 'Transaction', // Or derive from action type if stored
            timestamp: new Date(item.Timestamp).toLocaleString(),
            user: item.LoggedByMSP || 'Unknown',
            details: `Status: ${item.Value.status} | Hash: ${item.Value.dataHash ? item.Value.dataHash.substring(0, 10) + '...' : 'N/A'}`,
            txId: item.TxId
        }));

        setLogs(formattedLogs.reverse()); 
    } catch (err) {
        console.error(err);
        setError("Could not find history. Patient ID might be invalid or no records exist.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <PageLayout onLogout={onLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Immutable Audit Trail</h2>
              <p className="text-green-100 mt-1">
                Query the blockchain ledger directly for provenance
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Audit Portal</h3>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Patient ID (e.g., P099)"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search Ledger'}
            </button>
          </div>
        </div>

        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        )}

        {searchPerformed && !loading && !error && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800">
                Transaction History for {searchQuery}
              </h4>
              <span className="text-sm text-gray-600">
                {logs.length} block(s) found
              </span>
            </div>
            
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <AuditLogCard key={index} log={log} />
              ))
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No history found on blockchain</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AuditorPage;