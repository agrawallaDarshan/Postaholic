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
    image: {
      url: String,
      public_id: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        content: String,
        createdAt: { type: Date, default: Date.now() },
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
        likes: [{ type: ObjectId, ref: "User" }],
        reply: [
          {
            content: String,
            createdAt: { type: Date, default: Date.now() },
            postedBy: {
              type: ObjectId,
              ref: "User",
            },
          },
        ],
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
