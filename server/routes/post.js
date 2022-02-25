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
  formidableMiddleware({
    maxFileSize: 5 * 1024 * 1024,
  }),
  fs[1]
);

//user posts
router.get("/user-posts/:page", fs1[0], fs[2]);
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
router.put("/add-user-reply", fs1[0], fs[12]);
router.put("/remove-user-reply", fs1[0], fs[13]);

//likes and unlikes
router.put("/like-comment", fs1[0], fs[14]);
router.put("/unlike-comment", fs1[0], fs[15]);
router.put("/like-reply", fs1[0], fs[16]);
router.put("/unlike-reply", fs1[0], fs[17]);

//pagination
router.get("/total-posts", fs1[0], fs[18]);

router.get("/display-posts", fs[19]);

router.get("/single-public-post/:_id", fs[20]);

module.exports = router;
