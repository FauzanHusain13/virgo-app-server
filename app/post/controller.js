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
                            comments: []
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
        }
    },
    deletePost: async(req, res) => {
        try {
            const { id } = req.params

            const post = await Post.findOne({
                _id: id
            });
            
            if (!post) {
                return res.status(404).json({ message: "Postingan tidak ditemukan" });
            }
            
            await Post.findOneAndRemove({
                _id: id
            });

            let currentImage = `${rootPath}/public/uploads/post/${post.picturePath}`;
            
            if(fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage)
            }

            res.status(200).json({
                data: "Berhasil hapus postingan"
            })
        } catch (err) {
            res.status(409).json({ message: err.message })
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
            const { id } = req.params

            const post = await Post.findById(id)
            const isLiked = post.likes.get(req.user._id)

            if (!post) {
                return res.status(404).json({ message: "Post not found" })
            }
    
            if(isLiked) {
                post.likes.delete(req.user._id)
            } else {
                post.likes.set(req.user._id, true)
            }
    
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                { 
                    likes: post.likes 
                },
                { new: true }
            )
    
            res.status(200).json(updatedPost)  
        } catch (err) {
            res.status(409).json({ message: err.message })
        }
    },
    commentPost: async(req, res) => {
        try {
            const { id } = req.params
            const { comment } = req.body
        
            const post = await Post.findById(id)
        
            if (!post) {
              return res.status(404).json({ message: "Post not found" })
            }
        
            post.comments.push({
                _id: Math.random(8),
                comment: comment,
                user: req.user._id
            })
        
            const updatedPost = await post.save()
        
            res.status(200).json(updatedPost)
        } catch (err) {
            res.status(409).json({ message: err.message })
        }
    },
    commentDelete: async(req, res) => {
        try {
          const { id } = req.params;
          const { commentId } = req.body;
      
          const post = await Post.findById(id);
      
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
      
          const commentIndex = post.comments.findIndex(
            (comment) => comment._id.toString() === commentId
          );
      
          if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
          }
      
          if (req.user._id.toString() !== post.comments[commentIndex].user.toString()) {
            return res.status(400).json({ message: "You are not authorized to delete this comment" });
          }
      
          post.comments.splice(commentIndex, 1); // Menghapus komentar dari array
      
          const updatedPost = await post.save();
      
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
    },
}