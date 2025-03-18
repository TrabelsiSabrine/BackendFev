const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/addAdmin", adminController.addAdmin);
router.get("/getAllAdmins", adminController.getAllAdmins);
router.get("/getAdminById/:id", adminController.getAdminById);
router.put("/updateAdmin/:id", adminController.updateAdmin);
router.delete("/deleteAdminById/:id", adminController.deleteAdminById);
router.post("/login", adminController.login);

module.exports = router;
