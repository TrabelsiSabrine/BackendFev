var express = require('express');
var router = express.Router();
const contratController = require('../controllers/contratController'); // Correction ici ✅

router.get('/getAllContrats', contratController.getAllContrats);
router.get('/getContratById/:id', contratController.getContratById);
router.post('/addContrat', contratController.addContrat);
router.post('/affect', contratController.affect);
router.put('/updateContrat/:id', contratController.updateContrat);
router.delete('/deleteContratById/:id', contratController.deleteContratById);

module.exports = router;
