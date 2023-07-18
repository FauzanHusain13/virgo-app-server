const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        require: [true]
    }
})

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
    comments: [commentSchema]
}, { timestamps: true })

module.exports = mongoose.model("Post", postSchema)