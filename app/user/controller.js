const User = require("./model")
const { rootPath } = require("../../config")

module.exports = {
    getUser: async(req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findById(id)
    
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    editProfile: async(req, res) => {
        try {
            const { username = "", location = "" } =  req.body;
            const payload = {}

            if(username.length) payload.username = username
            if(location.length) payload.location = location

            if(req.file) {
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
                let filename = req.file.filename + "." + originalExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/profile/${filename}`);

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
                            username: user.name,
                            location: user.location,
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
    
            res.status(200).json(formattedFriends)
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    },
    addRemoveFriend: async(req, res) => {
        try {
            const { id, friendId } = req.params;
            const user = await User.findById(id)
            const friend = await User.findById(friendId)
    
            if(user.friends.includes(friendId)) {
                user.friends = user.friends.filter((id) => id !== friendId)
                friend.friends = friend.friends.filter((id) => id !== friendId)
            } else {
                user.friends.push(friendId)
                friend.friends.push(id)
            }
            await user.save()
            await friend.save()
    
            const friends = await Promise.all(
                user.friends.map((id) => User.findById(id))
            )
            const formattedFriends = friends.map(
                ({ _id, username, occupation, location, picturePath }) => {
                    return { _id, username, occupation, location, picturePath }
                }
            )
    
            res.status(200).json(formattedFriends)
        } catch (err) {
            res.status(500).json({ message: err.message || "Internal Server Error" })
        }
    }
}