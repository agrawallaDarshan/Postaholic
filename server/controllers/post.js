const Post = require("../models/post");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const postForm = async (req, res) => {
  const { postContent } = req.body;
  //Token Format : { _id: '##########', iat: 1641222733, exp: 1641654733 }
  // console.log(req.user);
  if (!postContent) {
    return res.json({
      error: "Post content is required",
    });
  }
  try {
    const post = new Post({
      postContent: postContent,
      postedBy: req.user._id,
    });
    await post.save();
    return res.json({
      message: "Post shared successfully",
    });
  } catch (err) {
    res.json({
      error: "Something wrong happened",
    });
  }
};

const uploadImage = async (req, res) => {
  // console.log(req.files);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log(result);
    res.json({
      url: result.url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = [postForm, uploadImage];
