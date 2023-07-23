var express = require('express')
var router = express.Router()
const { createPost, deletePost, getFeedPosts, getUserPost, getTrendingPost, likePost, commentPost, commentDelete, getDetailPost } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const multer = require("multer")
const upload = multer({ 
    dest: '/public/uploads/post',
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

router.get("/", getTrendingPost)
router.get("/:userId/feed", getFeedPosts)
router.get('/:userId/posts', getUserPost)
router.get('/:id/post', getDetailPost)

router.post('/create', upload.single("picturePath"), isLoginUser, createPost)
router.delete('/:id/delete', isLoginUser, deletePost)

router.patch('/:id/like', isLoginUser, likePost)

router.post('/:id/comment', isLoginUser, commentPost)
router.delete('/:id/:commentId/comment', isLoginUser, commentDelete)

module.exports = router;