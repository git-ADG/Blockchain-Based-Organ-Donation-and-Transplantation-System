import React from 'react';
import { CheckCircle, Clock, User } from 'lucide-react';

const AuditLogCard = ({ log }) => {
  const getEventColor = (event) => {
    switch (event) {
      case 'Created':
        return 'border-blue-500 bg-blue-50';
      case 'Updated':
        return 'border-yellow-500 bg-yellow-50';
      case 'Allocation Decision':
        return 'border-green-500 bg-green-50';
      case 'Procedure Completed':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getIconColor = (event) => {
    switch (event) {
      case 'Created':
        return 'text-blue-600 bg-blue-100';
      case 'Updated':
        return 'text-yellow-600 bg-yellow-100';
      case 'Allocation Decision':
        return 'text-green-600 bg-green-100';
      case 'Procedure Completed':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${getEventColor(log.event)}`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${getIconColor(log.event)}`}>
          <CheckCircle className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-semibold text-gray-800 text-lg">{log.event}</h5>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{log.timestamp}</span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Patient ID:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {log.id}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700">Performed by:</span>
              <span>{log.user}</span>
            </div>
            
            {log.details && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">{log.details}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Verified on blockchain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogCard;
