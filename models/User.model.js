const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true, maxlength: 50, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true,
    default: "USER",
  },
  glucose: [{ type: mongoose.Types.ObjectId, ref: "Glucose" }],
  blogPost: [{ type: mongoose.Types.ObjectId, ref: "BlogPost" }],
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
