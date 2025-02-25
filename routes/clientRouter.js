const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadFile');
const clientController = require("../controllers/clientController");
const {requireAuthUser} = require('../middlewares/authMiddleware');

router.post("/addClient", clientController.addClient);
router.post("/addClientWithImg", upload.single("user_image"), clientController.addClientWithImg);
router.get("/getAllClients", clientController.getAllClients);
router.get("/getClientById/:id", clientController.getClientById);
router.post('/login',clientController.login); 
router.post('/logout',clientController.logout); 
router.put("/updateClient/:id", clientController.updateClient);
router.delete("/deleteClientById/:id", clientController.deleteClientById);

router.get("/searchClientByUsername", clientController.searchClientByUsername);
router.get("/getAllClientsSortByAge", clientController.getAllClientsSortByAge);
router.get("/getAllClientsByAge/:age", clientController.getAllClientsByAge);
router.get("/getAllClientsBetweenAges", clientController.getAllClientsBetweenAges);

module.exports = router;
