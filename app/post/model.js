const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    picturePath: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    likes: {
        type: Map,
        of: Boolean
    },
    comments: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)