import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

export const cloudMediaService =  cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret : process.env.CLOUDINARY_CLOUD_API_SECRET
})
