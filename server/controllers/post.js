const Post = require("../models/post");
const User = require("../models/user");
const cloudinary = require("cloudinary");
const post = require("../models/post");

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

    //Now we have to render all posts of the user and the people sh/e followed
    const user = await User.findById(req.user._id);
    let following = user.following;
    following.push(user._id);

    const currentPage = req.params.page || 1;
    const perPageItems = 5;

    //$in => It means search for these content which are present in a particular data structure
    const posts = await Post.find({
      postedBy: {
        $in: following,
      },
    })
      .skip((currentPage - 1) * perPageItems)
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image")
      .sort({ createdAt: -1 })
      .limit(perPageItems);

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
      "_id name username photo"
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

const likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.body._id, {
      $addToSet: { likes: req.user._id },
    });

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.body._id, {
      $pull: { likes: req.user._id },
    });

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const addPostComment = async (req, res) => {
  try {
    const { _id, comment } = req.body;
    const post = await Post.findByIdAndUpdate(
      _id,
      {
        $push: {
          comments: {
            content: comment,
            postedBy: req.user._id,
          },
        },
      },
      { new: true }
    )
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image");

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const getUserPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image");

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const removeUserComment = async (req, res) => {
  try {
    const { _id, comment } = req.body;
    const post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    )
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image");

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const addUserReply = async (req, res) => {
  try {
    // console.log(req.user._id, req.body);
    const { postId, commentId, content } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
      },
      {
        $push: {
          "comments.$.reply": {
            content: content,
            postedBy: req.user._id,
          },
        },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image");

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const removeUserReply = async (req, res) => {
  try {
    // console.log(req.user._id, req.body);
    const { postId, commentId, replyId } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
      },
      {
        $pull: {
          "comments.$.reply": {
            _id: replyId,
          },
        },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image");

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          "comments.$[i].likes": req.user._id,
        },
      },
      {
        arrayFilters: [
          {
            "i._id": commentId,
          },
        ],
      }
    );

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { "comments.$[j].likes": req.user._id } },
      {
        arrayFilters: [
          {
            "j._id": commentId,
          },
        ],
      }
    );

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const likeReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $push: {
          "comments.$[i].reply.$[j].likes": req.user._id,
        },
      },
      {
        arrayFilters: [
          {
            "i._id": commentId,
          },
          {
            "j._id": replyId,
          },
        ],
      }
    );

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const unlikeReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $pull: {
          "comments.$[i].reply.$[j].likes": req.user._id,
        },
      },
      {
        arrayFilters: [
          {
            "i._id": commentId,
          },
          {
            "j._id": replyId,
          },
        ],
      }
    );

    return res.json(post);
  } catch (err) {
    console.log(err);
  }
};

const getTotalPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let following = user.following;
    following.push(user._id);

    const postCount = await Post.find({
      postedBy: {
        $in: following,
      },
    }).estimatedDocumentCount();
    return res.json(postCount);
  } catch (err) {
    console.log(err);
  }
};

const displayPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .limit(12)
      .sort({ createdAt: -1 })
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image");

    console.log(posts);

    return res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

const displaySinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params._id)
      .populate("postedBy", "_id name username image")
      .populate("comments.postedBy", "_id name username image")
      .populate("comments.reply.postedBy", "_id name username image");

    return res.json(post);
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
  likePost,
  unlikePost,
  addPostComment,
  getUserPost,
  removeUserComment,
  addUserReply,
  removeUserReply,
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
  getTotalPosts,
  displayPosts,
  displaySinglePost,
];
