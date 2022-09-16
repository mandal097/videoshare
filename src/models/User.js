const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },

    email: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
        require: true,
    },

    img: {
        type: String,
    },

    subscribers: {
        type: Number,
        default: 0
    },

    subscribedUsers: {
        type: [String]
    },
},
    { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

module.exports = User;