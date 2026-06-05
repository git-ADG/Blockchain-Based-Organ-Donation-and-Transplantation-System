const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/waiting-list/:organ', publicController.getWaitingList);
router.get('/donors/available', publicController.getAvailableDonors);

module.exports = router;