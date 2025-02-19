// routes/client_contratRouter.js
const express = require('express');
const router = express.Router();
const contratController = require('../controllers/client_contratController');

router.post('/', contratController.createContrat);
router.get('/', contratController.getAllContrats);

module.exports = router;
