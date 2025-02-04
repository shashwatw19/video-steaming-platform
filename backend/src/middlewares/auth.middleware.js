import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../middlewares/async.middleware.js'
dotenv.config()

const verifyJwt = asyncHandler(async(req , res , next)=>{
    try {
        const token = req.cookies?.token || req.headers("Authorization").replace("Bearer ","")
        if(!token)
            throw new ApiError(401,'Unauthorized request') 
         
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
        if(!user)
            throw new ApiError(401 , 'User not found')
    
        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401 , 'token verification failed' , error.message)
    }
})

export {verifyJwt}