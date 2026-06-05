const mongoose = require('mongoose');

const patientDataSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    dataHash: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    bloodType: String,
    organ: String,
    age: Number,
    urgency: String,
    hospitalId: String,
    
    type: { type: String, required: true }, 
    status: { type: String, default: 'Available' }, 
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PatientData', patientDataSchema);