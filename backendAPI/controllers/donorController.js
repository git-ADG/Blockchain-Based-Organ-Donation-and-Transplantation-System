const crypto = require('crypto');
const fabricService = require('../services/fabricService');
const dbService = require('../services/dbService');
const redisClient = require('../services/redisService');
const AppError = require('../utils/AppError');

exports.createDonor = async (req, res, next) => {
    try {
        const { user } = req;
        const { id, firstName, lastName, bloodType, medicalNotes, organ, age, urgency, type } = req.body;
        
        const patientId = id;

        if (fabricService.ledger.has(patientId)) {
            return next(new AppError(`Patient ID ${patientId} already exists!`, 400));
        }

        const medicalDataString = JSON.stringify({ firstName, lastName, medicalNotes, age });
        const dataHash = crypto.createHash('sha256').update(medicalDataString).digest('hex');

        const initialStatus = (type === 'Recipient') ? 'Waiting' : 'Available';

        await dbService.saveOffChainData(dataHash, medicalNotes, {
            id: patientId, 
            firstName,
            lastName,
            bloodType,
            organ,
            age,
            urgency,
            type, 
            status: initialStatus,
            hospitalId: user.organization
        });

        const result = await fabricService.submitTransaction(
            user.fabricIdentity, 
            user.role, 
            'CreateDonor', 
            patientId, 
            bloodType,
            dataHash,
            organ,
            age,
            urgency,
            type
        );

        if (organ) {
            await redisClient.del(`waitingList:${organ.toLowerCase()}`);
        }
        await redisClient.del('availableDonors');

        res.status(201).json({
            status: 'success',
            message: 'Patient registered securely.',
            txId: result.txId,
            data: { donorId: patientId }
        });
    } catch (err) {
        if (err.code === 11000) { 
             return next(new AppError(`Patient ID ${req.body.id} already exists in Database.`, 400));
        }
        next(err);
    }
};

exports.getDonor = async (req, res, next) => {
    try {
        const { user } = req;
        const { id } = req.params;

        if (id === 'all') {
             const allPatients = Array.from(fabricService.ledger.values());
             return res.status(200).json(allPatients);
        }

        const onChainData = await fabricService.evaluateTransaction(
            user.fabricIdentity,
            'ReadAsset', 
            id
        );

        res.status(200).json({
            status: 'success',
            data: {
                onChain: JSON.parse(onChainData)
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.allocateOrgan = async (req, res, next) => {
    try {
        const { user } = req;
        const { donorId, recipientId } = req.body;

        const result = await fabricService.submitTransaction(
            user.fabricIdentity,
            user.role,
            'LogAllocation',
            donorId,
            recipientId
        );

        const keys = await redisClient.keys('waitingList:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del('availableDonors');

        res.status(200).json({
            status: 'success',
            message: 'Allocation decision logged on blockchain.',
            txId: result.txId
        });
    } catch (err) {
        next(err);
    }
};