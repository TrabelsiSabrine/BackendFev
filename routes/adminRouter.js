const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/getAllAdmins", adminController.getAllAdmins);
router.post("/addAdmin", adminController.addAdmin);
router.put("/updateAdmin/:id", adminController.updateAdmin);
router.delete("/deleteAdminById/:id", adminController.deleteAdminById);

module.exports = router;
