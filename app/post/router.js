var express = require('express')
var router = express.Router()
const { createPost } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const multer = require("multer")
const upload = multer({ dest: '/public/uploads/post' })

router.post('/create', isLoginUser, upload.single("picturePath"), createPost)

module.exports = router;