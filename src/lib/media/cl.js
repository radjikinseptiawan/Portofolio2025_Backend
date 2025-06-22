const cloudinary = require("cloudinary") 
const dotenv = require("dotenv")
dotenv.config()

const cloudMediaService =  cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret : process.env.CLOUDINARY_CLOUD_API_SECRET
})

module.exports = cloudMediaService