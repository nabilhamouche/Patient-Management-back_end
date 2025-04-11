const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.post('/patients', patientController.addPatient);
router.get('/get-patients', patientController.getAllPatients);
router.get('/get-patients/:id', patientController.getPatientById);
module.exports = router;