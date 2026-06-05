const express = require('express');
const donorController = require('../controllers/donorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);


router.post('/', 
    authMiddleware.restrictTo('Medical_Staff'), 
    donorController.createDonor
);


router.get('/:id', 
    authMiddleware.restrictTo('Medical_Staff', 'Auditor', 'Transplant_Coordinator'), 
    donorController.getDonor
);

router.post('/allocate', 
    authMiddleware.restrictTo('Transplant_Coordinator'), 
    donorController.allocateOrgan
);

module.exports = router;