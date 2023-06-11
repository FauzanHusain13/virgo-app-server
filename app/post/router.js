var express = require('express')
var router = express.Router()
const { createPost, getFeedPosts, getUserPost, likePost, commentPost, commentDelete } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const multer = require("multer")
const upload = multer({ dest: '/public/uploads/post' })

router.get("/", isLoginUser, getFeedPosts)
router.post('/create', isLoginUser, upload.single("picturePath"), createPost)
router.get('/:id/posts', isLoginUser, getUserPost)
router.patch('/:id/like', isLoginUser, likePost)
router.post('/:id/comment', isLoginUser, commentPost)
router.delete('/:id/comment', isLoginUser, commentDelete)

module.exports = router;