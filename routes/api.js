
const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/units.controller');

router.get('/units', unitsController.getAllUnits);
router.post('/units/move', unitsController.moveUnit);

module.exports = router;
