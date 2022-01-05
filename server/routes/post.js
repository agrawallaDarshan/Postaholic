const express = require("express");

const router = express.Router();
const fs = require("../controllers/post");
const fs1 = require("../middlewares/auth");

router.post("/create-post", fs1[0], fs[0]);

module.exports = router;
