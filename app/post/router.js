var express = require('express')
var router = express.Router()
const { createPost, deletePost, getFeedPosts, getUserPost, likePost, commentPost, commentDelete } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const multer = require("multer")
const upload = multer({ 
    dest: '/public/uploads/post',
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
})

router.get("/", isLoginUser, getFeedPosts)
router.post('/create', upload.single("picturePath"), isLoginUser, createPost)
router.delete('/:id/delete', isLoginUser, deletePost)

router.get('/:id/posts', isLoginUser, getUserPost)
router.patch('/:id/like', isLoginUser, likePost)
router.post('/:id/comment', isLoginUser, commentPost)
router.delete('/:id/comment', isLoginUser, commentDelete)

module.exports = router;