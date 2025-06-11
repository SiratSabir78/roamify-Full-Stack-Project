const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");

// POST /admin/login
router.post("/login", loginAdmin);

module.exports = router;