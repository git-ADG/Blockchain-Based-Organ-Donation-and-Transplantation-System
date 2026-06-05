import React from 'react';
import { Shield, LogOut } from 'lucide-react';

const Navbar = ({ title, subtitle, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {title || 'Hospital Blockchain System'}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;