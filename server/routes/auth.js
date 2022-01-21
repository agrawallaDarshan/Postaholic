const express = require("express");
const jwt = require("express-jwt");

const router = express.Router();
const fs = require("../controllers/auth");
const fs1 = require("../middlewares/auth");

router.post("/register", fs[0]);
router.post("/login", fs[1]);
router.get("/current-user", fs1[0], fs[2]);
router.post("/forgot-password", fs[3]);
router.post("/send-email", fs[4]);
router.post("/verify-code", fs[5]);
router.put("/user-profile-update", fs1[0], fs[6]);
router.put("/user-password-update", fs1[0], fs[7]);

//user follow and unfollow
router.get("/find-people", fs1[0], fs[8]);
router.put("/user-follow", fs1[0], fs[9], fs[10]);
router.get("/get-following", fs1[0], fs[11]);
router.put("/user-unfollow", fs1[0], fs[12], fs[13]);
router.get("/get-followers", fs1[0], fs[14]);
router.put("/remove-follower", fs1[0], fs[15], fs[16]);

module.exports = router;
