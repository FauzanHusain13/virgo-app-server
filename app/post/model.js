const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    picturePath: {
        type: String,
    },
    description: {
        type: String,
    },
    likes: {
        type: Map,
        of: Boolean
    },
    comment: {
        type: Array,
        default: []
    }
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)