const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({

    image: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        maxlenngth: 50,
        required: true,
        unique: true,
    },

    author: {
        type: mongoose.Types.ObjectId, ref: "Admin"
    },

    date: {
        type: Date, 
        default: Date.now
    }

});

module.exports = mongoose.model("BlogPost", BlogPostSchema);