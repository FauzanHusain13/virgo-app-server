const fs = require("fs")
const path = require("path")
const User = require("./model")
const { rootPath } = require("../../config")

module.exports = {
    getAllUser: async(req, res) => {
        try {
            const user = await User.find()
    
            res.status(200).json({ data: user })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    getUser: async(req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id)
    
            res.status(200).json({ data: user })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    editProfile: async(req, res, next) => {
        try {
            const { username = "", location = "", occupation = "" } = req.body
            const payload = {}

            if(username.length) payload.username = username
            if(location.length) payload.location = location
            if(occupation.length) payload.occupation = occupation

            if(req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
                let filename = req.file.filename + "." + originalExt;
                let target_path = path.resolve(rootPath, `public/uploads/profile/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on("end", async() => {
                    let user = await User.findOne({ _id: req.user.id });
                    let currentImage = `${rootPath}/public/uploads/profile/${user.profilePath}`;
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage)
                    }

                    user = await User.findOneAndUpdate({
                        _id: req.user._id
                    },{
                        ...payload,
                        profilePath: filename
                    }, { new: true, runValidators: true })

                    res.status(201).json({
                        data: {
                            id: user.id,
                            username: user.username,
                            location: user.location,
                            occupation: user.occupation,
                            profilePath: user.profilePath
                        }
                    })
                })

                src.on("err", async() => {
                    next(err)
                })
            } else {
                const user = await User.findOneAndUpdate({
                    _id: req.user._id
                }, payload, { new: true, runValidators: true })

                res.status(201).json({
                    data: {
                        id: user.id,
                        username: user.username,
                        location: user.location,
                        occupation: user.occupation,
                        profilePath: user.profilePath
                    }
                })
            }
        } catch (err) {
            if(err && err.name === "ValidationError") {
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                })
            }
        }
    },
    getFriends: async(req, res) => {
        try {
            const { id } = req.params
            const user = await User.findById(id)

            const friends = await Promise.all(
                user.friends.map((id) => User.findById(id))
            )

            const formattedFriends = friends.map(
                ({ _id, username, occupation, location, picturePath }) => {
                    return { _id, username, occupation, location, picturePath }
                }
            )
    
            res.status(200).json({ data: formattedFriends })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    addRemoveFriend: async(req, res) => {
        try {
            const { friendId } = req.params;
            const user = await User.findById(req.user._id)
            const friend = await User.findById(friendId)
    
            if(friend.friends.includes(req.user._id)) {
                user.friends = user.friends.filter((id) => id.toString() !== friendId.toString())
                friend.friends = friend.friends.filter((id) => id.toString() !== req.user._id.toString())
            } else {
                user.friends.push(friendId.toString())
                friend.friends.push(req.user._id.toString())
            }
            await user.save()
            await friend.save()
    
            const friends = await Promise.all(
                user.friends.map((id) => User.findById(id))
            )
            const formattedFriends = friends.map(
                ({ _id, username, occupation, location, picturePath, }) => {
                    return { _id, username, occupation, location, picturePath }
                }
            )

            res.status(200).json({ data: formattedFriends })
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    searchUser: async (req, res) => {
        try {
          const { username } = req.body;
      
          const users = await User.find();
          const searchResults = users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
      
          res.status(200).json({ data: searchResults });
        } catch (err) {
          res.status(500).json({ message: err.message || 'Internal Server Error' });
        }
}
}