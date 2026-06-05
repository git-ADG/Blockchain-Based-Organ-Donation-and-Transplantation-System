const PatientData = require('../models/PatientData');

exports.saveOffChainData = async (dataHash, encryptedData, metaData) => {
    const record = await PatientData.create({
        dataHash,
        encryptedData, 
        ...metaData
    });
    return record;
};

exports.getAllPatients = async () => {
    return await PatientData.find({});
};

exports.updatePatientStatus = async (id, newStatus) => {
    return await PatientData.findOneAndUpdate(
        { id: id },
        { status: newStatus },
        { new: true }
    );
};

exports.getOffChainDataByHash = async (dataHash) => {
    return await PatientData.findOne({ dataHash });
};