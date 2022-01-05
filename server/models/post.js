const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    postContent: {
      type: {},
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    Image: {
      url: String,
      public_id: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    dislikes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        type: String,
        createdAt: { type: Date, default: Date.now() },
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
        likes: [{ type: ObjectId, ref: "User" }],
        replies: [
          {
            type: String,
            createdAt: { type: Date, default: Date.now() },
            postedBy: {
              type: ObjectId,
              ref: "User",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
