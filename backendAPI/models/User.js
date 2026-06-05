const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false
    },
    role: {
        type: String,
        enum: ['Medical_Staff', 'Transplant_Coordinator', 'Auditor'],
        default: 'Medical_Staff'
    },
    organization: {
        type: String,
        required: true,
        default: 'Org1'
    },
    fabricIdentity: {
        type: String,
        required: true,
        description: "The identity label used in the Fabric wallet (e.g., doctor_01)"
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);