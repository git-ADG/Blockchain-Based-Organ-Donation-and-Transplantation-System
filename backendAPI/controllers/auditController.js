const fabricService = require('../services/fabricService');

exports.getAssetHistory = async (req, res, next) => {
    try {
        const { user } = req;
        const { assetId } = req.params;

        const history = await fabricService.evaluateTransaction(
            user.fabricIdentity,
            'GetAssetHistory', 
            assetId
        );

        res.status(200).json({
            status: 'success',
            results: history.length,
            data: history
        });
    } catch (err) {
        next(err);
    }
};