import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()


// write the follwing keys in .env file
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadImageOnCloudinary = async(localFilePath)=>{
    if(!localFilePath)
        return null
    else{
       try{
         const response = await cloudinary.uploader.upload(localFilePath , {folder : 'playzone' , resource_type : 'auto'})
         fs.unlinkSync(localFilePath)
         
         console.log(response?.secure_url)
         return response
       }catch (error){
            console.log('error while uploading image on cloudinary', error.message)
            fs.unlink(localFilePath)
            return null
       } 
    }
}

export {uploadImageOnCloudinary}