import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";


const signUp = asyncHandler(async(req,res)=>{
    
    const {username , email , password } = req.body

    if([username , email , password].some((field => field?.trim()) === ''))
        return new ApiError(400 , 'All fields are required')

    const existedUser = await User.find({
        $or : [{email},{username}]
    })

    if(existedUser)
        return new ApiError(400 , 'User already exists with username or email')
    
    const avatarImage = req.files?.avatar[0]?.path
    let avatarUrl = ''
    
    if(avatarImage){
        const resposne = await uploadImageOnCloudinary(avatarImage)
        avatarUrl = resposne?.secure_url
    }else{
        avatarUrl = '../public/images/default_image.png'
    }
        
    const coverImage = req.files?.coverImage[0]?.path
    let coverUrl = ''

    if(coverImage){
        const response = await uploadImageOnCloudinary(coverImage)
        coverUrl = response?.secure_url
    }else{
        coverUrl = '../public/images/default_cover.png'
    }


    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
        avatar : avatarUrl,
        coverImage : coverUrl
    })
        
    const createdUser = await user.findById(user._id).select('-password' , '-refreshToken')

    if(!createdUser)
        return new ApiError(500 , 'Something went wrong while creating User')

    return res.status(201).json(
        new ApiResponse(200 , 'User created Successfully' , createdUser)
    )
    
})

export {signUp}