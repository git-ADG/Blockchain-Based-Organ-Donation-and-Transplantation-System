import React from 'react';
import Navbar from '../shared/Navbar';

const PageLayout = ({ children, title, subtitle, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={title} subtitle={subtitle} onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;