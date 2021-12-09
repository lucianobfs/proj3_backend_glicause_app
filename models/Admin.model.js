const { Schema, model } = require("mongoose");

const AdminSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    blogPost: [{ type: mongoose.Types.ObjectId, ref: "BlogPost" }],

  });
  
  module.exports = mongoose.model("Admin", AdminSchema);