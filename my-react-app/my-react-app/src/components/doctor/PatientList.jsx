import React from 'react';
import { Eye } from 'lucide-react';
import { getStatusColor } from '../../utils/helpers';

const PatientList = ({ patients, onSelectPatient }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Patient Registry</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Organ</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Blood</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Urgency</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{patient.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.organ || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{patient.bloodType}</td>
                <td className="px-6 py-4 text-sm">
                    {patient.urgency === 'Critical' ? 
                        <span className="text-red-600 font-bold">Critical</span> : 
                        <span className="text-gray-600">{patient.urgency || 'N/A'}</span>
                    }
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onSelectPatient(patient)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No patients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;