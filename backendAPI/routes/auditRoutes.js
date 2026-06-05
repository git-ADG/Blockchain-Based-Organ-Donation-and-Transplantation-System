const express = require('express');
const auditController = require('../controllers/auditController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/history/:assetId', 
    authMiddleware.restrictTo('Auditor'), 
    auditController.getAssetHistory
);

module.exports = router;