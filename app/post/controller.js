const Post = require("../post/model")
const User = require("../user/model")

const path = require("path")
const fs = require("fs")
const { rootPath } = require("../../config")

module.exports = {
    createPost: async(req, res) => {
        try {
            const { description } = req.body;

            if(req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
                let filename = req.file.filename + "." + originalExt;
                let target_path = path.resolve(rootPath, `public/uploads/post/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on("end", async() => {
                    try {
                        const post = new Post({ 
                            user: req.user._id,
                            description, 
                            picturePath: filename,
                            likes: {},
                            comments: {}
                        })

                        await post.save();

                        res.status(201).json({
                            data: post
                        })
                    } catch (err) {
                        if(err && err.name === "ValidationError") {
                            return res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            })
                        }
                        next(err)
                    }
                })
            } else {
                res.status(409).json({ message: err.message })
            }
        } catch (err) {
            if(err && err.name === "ValidationError") {
                return res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
            next(err)
        }
    },
    getFeedPosts: async(req, res) => {
        try {
            const post = await Post.find()
            res.status(200).json(post)
        } catch (err) {
            res.status(409).json({ message: err.message }) 
        }
    },
    getUserPost: async(req, res) => {
        try {
            const { userId } = req.params
            const post = await Post.find({ userId })

            res.status(200).json(post)
        } catch (err) {
            res.status(409).json({ message: err.message })
        }
    },
    likePost: async(req, res) => {
        try {
            
        } catch (err) {
            res.status(409).json({ message: err.message })
        }
    }
}