var express = require('express')
var router = express.Router()
const { getAllUser, getUser, editProfile, getFriends, addRemoveFriend } = require("./controller")
const { isLoginUser } = require("../middleware/auth")

const multer = require("multer")
const upload = multer({ dest: '/public/uploads/profile' })

router.get('/all', getAllUser)
router.get('/:id', getUser)
router.put('/edit', isLoginUser, upload.single("profilePath"), editProfile)
router.get("/:id/friends", isLoginUser, getFriends)
router.patch("/:id/:friendId", isLoginUser, addRemoveFriend)

module.exports = router;