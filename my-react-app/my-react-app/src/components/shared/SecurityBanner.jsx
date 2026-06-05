import React from 'react';
import { Database, Shield, Lock, AlertCircle } from 'lucide-react';

const SecurityBanner = ({ type, message, variant = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'silo':
        return <Database className="w-5 h-5" />;
      case 'rbac':
        return <Shield className="w-5 h-5" />;
      case 'immutable':
        return <Lock className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (variant) {
      case 'info':
        return 'bg-blue-50 border-blue-600 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-600 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-600 text-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-600 text-red-800';
      case 'purple':
        return 'bg-purple-50 border-purple-600 text-purple-800';
      default:
        return 'bg-blue-50 border-blue-600 text-blue-800';
    }
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg flex items-center gap-3 ${getStyles()}`}>
      {getIcon()}
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default SecurityBanner;