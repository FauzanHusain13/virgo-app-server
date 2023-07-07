const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const HASH_ROUND = 10

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 2,
        max: 30
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 5,
    },
    profilePath: {
        type: String,
    },
    friends: {
        type: Array,
        default: []
    },
    location: { type: String },
    occupation: { type: String },
    viewedProfile: { type: Number },
    impressions: { type: Number }
}, { timestamps: true })

userSchema.pre("save", function(next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = mongoose.model("User", userSchema)