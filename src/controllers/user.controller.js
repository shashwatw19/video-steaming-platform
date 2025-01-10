import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async(userId)=>{
    
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken , refreshToken}
}

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

const signIn = asyncHandler(async(req,res)=>{
    
    const {email , password , username} = req.body

    if([email , username].some((field=>field?.trim()) === ''))
        return new ApiError(400 , 'Email or Username is required')

    const user = await User.find({
        $or : [{email},{username}]
    }).select('-password' , '-refreshToken')

    if(!user)
        return new ApiError(404 , 'User not found!')
    
    const isPasswordMatched = await user.matchPassword(password)

    if(!isPasswordMatched)  
        return new ApiError(401 , 'inValid credentials')

    const {accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpsOnly : true,
        secure : true
    }

    return res.status(201)
    .cookie('accessToken' , accessToken, options)
    .cookie('refreshToken' , refreshToken , options)
    .json(
        new ApiResponse(200 , 'User loggedIn Succesfully' , user)
    )
})
export {signUp , signIn}