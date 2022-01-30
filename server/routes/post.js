const express = require("express");
const formidableMiddleware = require("express-formidable");

const router = express.Router();
const fs = require("../controllers/post");
const fs1 = require("../middlewares/auth");
const fs2 = require("../middlewares/post");

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
router.get("/user-post-edit/:_id", fs1[0], fs[3]);
router.put("/user-post-update/:_id", fs1[0], fs2[0], fs[4]);
router.delete("/user-post-delete/:_id", fs1[0], fs2[0], fs[5]);
router.delete("/delete-image/:_id", fs1[0], fs[6]);

//like-unlike post
router.put("/like-post", fs1[0], fs[7]);
router.put("/unlike-post", fs1[0], fs[8]);

//post, delete and reply comments
router.put("/add-post-comment", fs1[0], fs[9]);
router.get("/get-user-post/:_id", fs1[0], fs[10]);
router.put("/remove-user-comment", fs1[0], fs[11]);
module.exports = router;
