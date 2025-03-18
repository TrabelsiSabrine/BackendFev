const express = require("express");
const router = express.Router();
const policeController = require("../controllers/policeController");

router.post("/add", policeController.addPolice);
router.get("/getById/:id", policeController.getPoliceById);
router.put("/update/:id", policeController.updatePolice);
router.delete("/delete/:id", policeController.deletePoliceById);

module.exports = router;
