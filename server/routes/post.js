const express = require("express");
const formidableMiddleware = require("express-formidable");

const router = express.Router();
const fs = require("../controllers/post");
const fs1 = require("../middlewares/auth");

//So, express-formidable is something like a bridge between them, specifically an Express middleware implementation of Formidable. It is used to parse the formdata like express.json which is used to parse the json data

router.post("/create-post", fs1[0], fs[0]);
router.post(
  "/upload-image",
  fs1[0],
  formidableMiddleware({
    maxFileSize: 5 * 1024 * 1024,
  }),
  fs[1]
);

//user posts
router.get("/user-posts", fs1[0], fs[2]);

module.exports = router;
