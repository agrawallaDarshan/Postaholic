const express = require("express");
const jwt = require("express-jwt");

const router = express.Router();
const fs = require("../controllers/auth");
const fs1 = require("../middlewares/auth");

router.post("/register", fs[0]);
router.post("/login", fs[1]);
router.get("/current-user", fs1[0], fs[2]);

module.exports = router;
