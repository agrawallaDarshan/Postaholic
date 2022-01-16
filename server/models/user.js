//Schema refers to organisation or blueprint of the data defined in database management system
//Mongodb is schemaless language but moongose require schema
const moongose = require("mongoose");
const { Schema } = moongose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      max: 32,
      required: true,
    },
    username: {
      type: String,
      min: 6,
      max: 24,
      required: true,
      unique: true,
    },
    securityQuestion: {
      type: String,
      required: true,
    },
    security: {
      type: String,
      required: true,
    },
    about: {},
    image: {
      url: String,
      public_id: String,
    },
    following: [{ type: Schema.ObjectId, ref: "User" }],
    followers: [{ type: Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

//export the model named User
module.exports = moongose.model("User", userSchema);
