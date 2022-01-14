const Post = require("../models/post");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const postForm = async (req, res) => {
  const { postContent, image } = req.body;
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
      image: image,
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
    if (req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.path);
      res.json({
        url: result.url,
        public_id: result.public_id,
        message: "Image uploaded successfully",
      });
    }
    // console.log(result);
  } catch (err) {
    console.log(err);
  }
};

const userPosts = async (req, res) => {
  try {
    //mongodb queries
    //populate() => Basically it uses to join or link two mongoose schemas. If we call populate function then an array of documents will be returned from the ref mongoose schema which will replace the original _id.
    //Sort() => sort the results (-1  = Desc and 1 = Asc)
    // const posts = await Post.find({ postedBy: req.user._id })
    const posts = await Post.find()
      .populate("postedBy", "_id name photo")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

const userPostEdit = async (req, res) => {
  // console.log(req.params._id);
  try {
    const post = await Post.findById(req.params._id).populate(
      "postedBy",
      "_id name photo"
    );
    return res.json({
      post: post,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateUserPost = async (req, res) => {
  const { postContent, image } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params._id,
      {
        postContent: postContent,
        image: image,
        isEdited: true,
      },
      {
        new: true,
      }
    );
    return res.json({
      post,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Something wrong happened",
    });
  }
};

const deleteUserPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    if (post.image && post.image.public_id) {
      const image = await cloudinary.uploader.destroy(post.image.public_id);
    }

    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteUserPostImage = async (req, res) => {
  try {
    const image = await cloudinary.uploader.destroy(req.params._id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = [
  postForm,
  uploadImage,
  userPosts,
  userPostEdit,
  updateUserPost,
  deleteUserPost,
  deleteUserPostImage,
];
