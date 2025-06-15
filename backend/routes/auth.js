const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController"); // ✅ Make sure this path is correct

router.post("/login", loginUser); // ❌ Error happens if loginUser is undefined

module.exports = router;
