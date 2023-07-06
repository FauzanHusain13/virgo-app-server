const User = require("../user/model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { jwtkey } = require("../../config")

module.exports = {
    register: async(req, res) => {
        try {
            const { username, email, password, profilePath, friends, location, occupation } = req.body;

            // cek duplikat email
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              return res.status(400).json({ message: `${email} sudah terdaftar!` });
            }

            const newUser = new User({
                username,
                email, 
                password, 
                profilePath, 
                friends, 
                location, 
                occupation,
                viewedProfile: Math.floor(Math.random() * 10000),
                impression: Math.floor(Math.random() * 10000),
            })
            const savedUser = await newUser.save()
            res.status(201).json({ data: savedUser })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },
    login: async(req, res) => {
        const { email, password } = req.body

        User.findOne({ email }).then((user) => {
            if(user) {
                const checkPassword = bcrypt.compareSync(password, user.password)
                // const checkPassword = password === user.password
  
                if (checkPassword) {
                    const token = jwt.sign({
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            profilePath: user.profilePath,
                            occupation: user.occupation,
                            friends: user.friends,
                            location: user.location,
                            viewedProfile: user.viewedProfile,
                        }
                    }, jwtkey)
  
                    res.status(200).json({
                        data: { token }
                    })
                } else {
                    res.status(403).json({
                        message: "password yang anda masukkan salah!"
                    })  
                }
            } else {
                res.status(403).json({
                    message: "email yang anda masukkan belum terdaftar!"
                })
            }
        }).catch((err) => {
            res.status(500).json({
                message: err.message || `Internal server error`
            })
        })
    }
}