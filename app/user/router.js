var express = require('express')
var router = express.Router()
const { getUser, getUserFriends, addRemoveFriend } = require("./controller")

router.get('/:id', getUser)
router.get("/:id/friends", getUserFriends)
router.patch("/:id/:friendId", addRemoveFriend)

module.exports = router;