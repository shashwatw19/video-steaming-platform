import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";
import { Otp } from "../models/otp.model.js";
import {Profile} from '../models/profile.model.js'
import mongoose from 'mongoose'
const generateAccessAndRefreshToken = async(userId)=>{
    
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})

    return {accessToken , refreshToken}
}

// flow for signup
// 1.first the request will be sent to createOtp
// 2. then it will be sent to sign where otp will be verfied
// 3. then the user will be created


const signUp = asyncHandler(async(req,res)=>{
    
    const {username , email , password  , otp} = req.body

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

    // verify email thorugh otp
    let currentOtp = otp
    
    const generatedOtp = await Otp.find({email}).select('otp').sort({createdAt : -1}).limit(1)
    
    if(!generatedOtp)
        return new ApiError(404 , 'Otp not found')

    if(generatedOtp.otp !== currentOtp)
        return new ApiError(401 , 'Invalid Otp')


    // create a new profileDetails for the user

    const userProfile = await Profile.create({
        bio : undefined,
        social : {
            youtube : undefined,
            twitter : undefined,
            facebook : undefined,
            linkedin : undefined,
            instagram : undefined
        },
        gender : undefined
    })

    if(!userProfile)
        return new ApiError(403 , 'Error while creating user profile')


    // craete a new User
    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password,
        avatar : avatarUrl,
        coverImage : coverUrl,
        additionalDetails : userProfile._id
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

const logout = asyncHandler(async(req,res)=>{
    const currentUser = req.user._id

    await User.findByIdAndUpdate(currentUser._id , 
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        })
    
    const options = {
        httpOnly : true,
        secure : true
    }


    return res.status(201)
    .clearCookie('accessToken' , options)
    .clearCookie('refreshToken' , options)
    .json(
        new ApiResponse(200 , 'User logged out successfully')
    )
})

const forgotPassword = asyncHandler(async(req,res)=>{
    
    const {email} = req.body
    
    const validUser = await User.findOne({ email });
    if(!validUser)
        throw new ApiError(404 , 'User not found with this email')

    const resetPasswordToken =  await validUser.generateResetPasswordToken()

    if(!resetPasswordToken)
        throw new ApiError(404 , 'Error while generating reset password token')

    await validUser.save({ validateBeforeSave: false })
})
const resetPassword = asyncHandler(async(req,res)=>{
    const {resetPasswordToken } = req.params

    const {password , newPassword} = req.body

    const user = await User.findOne({resetPasswordToken}).select('-refreshToken' , '-password')
    
   
    if(!user)
        throw new ApiError(404 , 'Invalid reset password Token')

    if(!user.matchPassword(password))
        throw new ApiError(401 , 'wrong credentials')

    if(user.resetPasswordExpires < Date.now())
        throw new ApiError(403 , 'resetPassword Token expired')

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    return res.status(201).json(
        new ApiResponse(200 , 'Password Reset Successfull' , { _id : user._id , username : user.username , email : user.email} )
    )
})

const updatePassword = asyncHandler(async(req,res)=>{
    const user = req.user._id
    
    const {password , newPassword} = req.body

    const validUser = await user.findOne({_id}).select('-refreshtoken' , '-password')

    if(!validUser)
        return new ApiError(403 , 'User not found')
    if(!validUser.matchPassword(password))
        return new ApiError(401 , 'Invalid credentials')

    validUser.password = newPassword

    return res.status(201).json(
        new ApiResponse(200 , 'Password updated' , {validUser})
    )

})

const updateAvatarImage = asyncHandler(async(req,res)=>{
    const user = req.user._id

    const newAvatarImage = req.files?.avatar[0]?.path

    if(!newAvatarImage)
        return new ApiError(400 , 'please provide an image')

    const response = await uploadImageOnCloudinary(newAvatarImage)
    
    if(!response)
        return new ApiError(403 , 'error while uploading avatar image ')

    user.avatar = response?.secure_url

    user.save()

    return res.status(201).json(
        new ApiResponse(200 , 'Avatar iamge update' , {avatar : user.avatar})
    )
})
const updateCoverImage = asyncHandler(async(req,res)=>{
    const user = req.user._id

    const newCoverImage = req.files?.coverImage[0]?.path

    if(!newCoverImage)
        return new ApiError(400 , 'please provide an image')

    const response = await uploadImageOnCloudinary(newCoverImage)
    
    if(!response)
        return new ApiError(403 , 'error while uploading cover image ')

    user.coverImage = response?.secure_url

    user.save()

    return res.status(201).json(
        new ApiResponse(200 , 'Avatar iamge update' , {coverImage : user.coverImage})
    )
})
const updateProfile = asyncHandler(async(req , res)=>{
    const user = req.user._id

    const {bio , social , gender} = req.body

    const userProfile = await Profile.findOne({user : user._id})

    if(!userProfile)    
        return new ApiError(404 , 'User profile not found')

    if(bio && bio.trim() !== '')
        userProfile.bio = bio

    if (social) {
        userProfile.social = {
            youtube: social.youtube || userProfile.social.youtube,
            twitter: social.twitter || userProfile.social.twitter,
            facebook: social.facebook || userProfile.social.facebook,
            linkedin: social.linkedin || userProfile.social.linkedin,
            instagram: social.instagram || userProfile.social.instagram
        };
    }

    if(gender && gender.trim() !== '')
        userProfile.gender = gender

    await userProfile.save();

    return res.status(200).json(
        new ApiResponse(200, 'Profile updated successfully', userProfile)
    );

})
// get userChannleDetails
const getUserChannelDetails = asyncHandler(async(req,res)=>{
    const {username}  = req.params

    if(!username?.trim())
        throw new ApiError(400 , 'username us required')

    const channelDetails = await User.aggregate([
        {
            $match : {username : username?.toLowerCase()}
        },
        {   
            // total no. of subscribers
            $lookup : {
                from : 'subscriptions',
                localField : '_id',
                foreignField : 'channel',
                as : 'subscribers'
            }
        },
        {
            // total channel subscribed
            $lookup : {
                from : 'subscriptions',
                localField : '_id',
                foreignField : 'subscriber',
                as : 'subscribedTo'
            }
        },
        {
            
            $addFields : {
                totalSubscribers : {
                    $size : '$subscribers'
                },
                totalChannelSubcribed : {
                    $size : '$subscribedTo'
                },
                isSubscribed : {
                    $cond : {
                        if : {$in : [req.user?._id , '$subscribers.subscriber']},
                        then : true,
                        else : false 
                    }
                }
            }
        },
        {
            $project : {
                username : 1,
                email : 1 ,
                avatar : 1,
                coverImage : 1,
                totalSubscribers : 1,
                totalChannelSubcribed : 1,
                isSubscribed : 1,
                createdAt : 1
            }
        }
    ])
    console.log('channelDetails' , channelDetails)

    if(!channel?.length)
        throw new ApiError(404 , 'Channel not found')

    return res.status(201).json(
        new ApiResponse(200 , 'Channel details fetched' , channelDetails[0])
    )
})

// get user watch history
const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup : {
                from : 'vidoes',
                localField : 'watchHistory',
                foreignField : '_id',
                as : 'watchHistory',
                pipeline: [
                    {
                        $lookup : {
                            from : 'users',
                            localField : 'owner',
                            foreignField : '_id',
                            as : 'owner',
                            pipeline : [
                                {
                                    $project : {
                                        username : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields : {
                            owner : {
                                $first : '$owner'
                            } 
                        }
                    }
                ]
            }
        },
        
    ])

    if(!user?.length)
        return res.status(201).json(
            new ApiResponse( 200 , 'no watch history found'))

    return res.status(201).json(
        new ApiResponse(200 , 'watch history fetched' , user[0]?.watchHistory)
    )
})

// refresh token

const refresAccessToken = asyncHandler(async(req,res)=>{
    const {token} = req.cookies || req.body

    if(!token)
        return new ApiError(401 , 'Unauthorized')
    
    const user = await user.findOne({token}).select('-password' , '-refreshToken')

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpsOnly : true,
        secure : true
    }

    return res.status(201).
    cookie('accessToken' , accessToken , options).
    cookie('refreshToken' , refreshToken , options).
    json(
        new ApiResponse(200 , 'Token Refreshed' , {accessToken , refreshToken})
    )
})
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

export {signUp , signIn , logout , forgotPassword , resetPassword , updatePassword , updateAvatarImage , updateCoverImage , updateProfile , getUserChannelDetails , getWatchHistory , refresAccessToken ,getCurrentUser}
