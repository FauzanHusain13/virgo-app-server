var express = require('express')
var router = express.Router()
const { createPost, getFeedPosts, getUserPost } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const multer = require("multer")
const upload = multer({ dest: '/public/uploads/post' })

router.get("/", isLoginUser, getFeedPosts)
router.post('/create', isLoginUser, upload.single("picturePath"), createPost)
router.get('/:id/posts', isLoginUser, getUserPost)

module.exports = router;