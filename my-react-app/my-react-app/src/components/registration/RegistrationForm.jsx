import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { bloodTypes, patientTypes } from '../../data/mockPatients';
import { validatePatientData, generateRecordHash } from '../../utils/helpers';
import { api } from '../../utils/api';

const RegistrationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    bloodType: 'O+',
    type: 'Donor',
    organ: 'Kidney',
    age: '',
    urgency: 'N/A',
    recordHash: ''
  });
  
  const [errors, setErrors] = useState({});

  const organTypes = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas'];
  const urgencyLevels = ['N/A', 'Low', 'Medium', 'High', 'Critical'];

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'type') {
        newData.urgency = value === 'Donor' ? 'N/A' : 'Medium';
      }
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    const validation = validatePatientData(formData);
    
    if (!formData.age || formData.age < 0) validation.errors.age = "Valid age is required";
    if (formData.type === 'Recipient' && formData.urgency === 'N/A') validation.errors.urgency = "Recipients must have an urgency level";

    if (Object.keys(validation.errors).length > 0) {
      setErrors(validation.errors);
      return;
    }

    try {
      await api.registerPatient(formData);
      onSubmit(formData);
      onClose();
      alert("Patient saved to Blockchain & Database successfully!");
    } catch (err) {
      alert("Error saving patient: " + err.message);
    }
  };

  const handleGenerateHash = () => {
    setFormData(prev => ({ ...prev, recordHash: generateRecordHash() }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Register New Patient</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Info */}
          <div className="col-span-2 md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
             <input type="text" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="col-span-2 md:col-span-1">
             <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
             <input type="text" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
            <input type="text" value={formData.id} onChange={(e) => handleChange('id', e.target.value)}
              placeholder="P099"
              className={`w-full px-4 py-2 rounded-lg border ${errors.id ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`} />
            {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
             {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          {/* Medical Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
            <select value={formData.bloodType} onChange={(e) => handleChange('bloodType', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
              {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Type</label>
            <select value={formData.type} onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
              {patientTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Organ</label>
            <select value={formData.organ} onChange={(e) => handleChange('organ', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none">
              {organTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <select 
              value={formData.urgency} 
              onChange={(e) => handleChange('urgency', e.target.value)}
              disabled={formData.type === 'Donor'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100">
              {urgencyLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Record Hash (Off-Chain Link)</label>
            <div className="flex gap-2">
              <input type="text" value={formData.recordHash} onChange={(e) => handleChange('recordHash', e.target.value)}
                placeholder="0x..."
                className={`flex-1 px-4 py-2 rounded-lg border ${errors.recordHash ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 outline-none`} />
              <button onClick={handleGenerateHash} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                Generate
              </button>
            </div>
            {errors.recordHash && <p className="text-red-500 text-xs mt-1">{errors.recordHash}</p>}
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mt-6">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">This action creates an immutable record on the blockchain</p>
        </div>

        <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Submit Registration</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;