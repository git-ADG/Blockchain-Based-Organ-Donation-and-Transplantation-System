const mongoose = require('mongoose');
const PatientData = require('./models/PatientData');
const config = require('./config/config');

const organs = ['Kidney', 'Liver', 'Heart', 'Lungs', 'Pancreas'];
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];
const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(config.mongoUri);
        console.log('Connected! Generating 100 patients...');


        const patients = [];
        for (let i = 1; i <= 100; i++) {
            const isRecipient = Math.random() > 0.3; 
            
            const type = isRecipient ? 'Recipient' : 'Donor';
            const status = isRecipient ? 'Waiting' : 'Available';
            const urgency = isRecipient ? urgencies[Math.floor(Math.random() * urgencies.length)] : 'N/A';
            const organ = organs[Math.floor(Math.random() * organs.length)];
            const age = Math.floor(Math.random() * 60) + 18; // Age 18-78

            patients.push({
                id: `P${1000 + i}`, 
                firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
                organ: organ,
                age: age,
                urgency: urgency,
                type: type,
                status: status,
                hospitalId: 'HospitalA',
                dataHash: `hash-${Date.now()}-${i}`,
                encryptedData: 'dummy-encrypted-string-for-simulation'
            });
        }

        await PatientData.insertMany(patients);
        
        console.log(' Successfully added 100 dummy patients to MongoDB!');
        console.log('   - 70% Recipients (Testing Waiting List)');
        console.log('   - 30% Donors (Testing Allocation)');
        
        process.exit();
    } catch (err) {
        console.error(' Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();