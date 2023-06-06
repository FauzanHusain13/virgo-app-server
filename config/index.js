const dotenv = require("dotenv")
const path = require("path")

dotenv.config()

module.exports = {
    serviceName: process.env.SERVICE_NAME,
    urlDb: process.env.MONGO_URL,
    jwtkey: process.env.JWT_KEY,
    rootPath: path.resolve(__dirname, ".."),
}