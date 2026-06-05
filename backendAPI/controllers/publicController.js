const fabricService = require('../services/fabricService');
const redisClient = require('../services/redisService');

const urgencyRank = {
  'Critical': 1,
  'High': 2,
  'Medium': 3,
  'Low': 4,
  'N/A': 5
};

exports.getWaitingList = async (req, res, next) => {
    try {
        const { organ } = req.params;
        const cacheKey = `waitingList:${organ.toLowerCase()}`;
        
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                status: 'success',
                source: 'redis-cache',
                results: JSON.parse(cachedData).length,
                data: JSON.parse(cachedData)
            });
        }

        const rawData = await fabricService.evaluateTransaction('admin', 'GetAllAssets');
        const allData = JSON.parse(rawData);

        let waitingList = allData.filter(p => 
            p.type === 'Recipient' && 
            p.status === 'Waiting' &&
            p.organ && p.organ.toLowerCase() === organ.toLowerCase()
        );

        waitingList.sort((a, b) => {
            const rankA = urgencyRank[a.urgency] || 99;
            const rankB = urgencyRank[b.urgency] || 99;
            return rankA - rankB;
        });

        await redisClient.setEx(cacheKey, 60, JSON.stringify(waitingList));

        res.status(200).json({
            status: 'success',
            source: 'blockchain-ledger',
            results: waitingList.length,
            data: waitingList
        });

    } catch (err) {
        next(err);
    }
};

exports.getAvailableDonors = async (req, res, next) => {
    try {
        const cacheKey = 'availableDonors';

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                status: 'success',
                source: 'redis-cache',
                results: JSON.parse(cachedData).length,
                data: JSON.parse(cachedData)
            });
        }

        const rawData = await fabricService.evaluateTransaction('admin', 'GetAllAssets');
        const allData = JSON.parse(rawData);

        const donors = allData.filter(p => 
            p.type === 'Donor' && 
            p.status === 'Available'
        );

        await redisClient.setEx(cacheKey, 60, JSON.stringify(donors));

        res.status(200).json({
            status: 'success',
            source: 'blockchain-ledger',
            results: donors.length,
            data: donors
        });

    } catch (err) {
        next(err);
    }
};