import React from 'react';
import { X, User, Droplet, FileText, Activity, Heart, AlertTriangle } from 'lucide-react';

const PatientDetailsModal = ({ patient, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Patient Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">ID & Age</p>
              <p className="font-semibold text-gray-800">{patient.id} <span className="text-gray-400">|</span> {patient.age || 'N/A'} yrs</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Activity className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                <p className="text-xs text-gray-600">Type</p>
                <p className="font-semibold text-gray-800">{patient.type}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <Droplet className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                <p className="text-xs text-gray-600">Blood</p>
                <p className="font-semibold text-gray-800">{patient.bloodType}</p>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Heart className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                <p className="text-xs text-gray-600">Organ</p>
                <p className="font-semibold text-gray-800">{patient.organ || 'Unknown'}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div className="flex-1">
                <p className="text-xs text-gray-600">Urgency</p>
                <p className="font-semibold text-gray-800">{patient.urgency || 'Normal'}</p>
                </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <FileText className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Current Status</p>
              <p className="font-semibold text-gray-800">{patient.status}</p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Medical Record Hash</p>
            <p className="font-mono text-xs text-gray-800 break-all">
              {patient.recordHash}
            </p>
          </div>
        </div>
        
        <button onClick={onClose} className="w-full mt-6 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
          Close
        </button>
      </div>
    </div>
  );
};

export default PatientDetailsModal;