const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({

    userId: {
        type: String,
        require: true,
    },

    videoId: {
        type: String,
        require: true,
    },

    desc: {
        type: String,
        require: true,
    },

},
    { timestamps: true }
);

const Comments = new mongoose.model("Comments", CommentsSchema);

module.exports = Comments;