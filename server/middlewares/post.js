const Post = require("../models/post");

const postUserAccess = async (req, res, next) => {
  const post = await Post.findById(req.params._id);
  //   console.log(post);
  //   console.log(req.params);
  //   console.log(req.user);
  if (post.postedBy != req.user._id) {
    return res.status(400);
  } else {
    next();
  }
};

module.exports = [postUserAccess];
