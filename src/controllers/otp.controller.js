import {Otp} from '../models/otp.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const createOtp = asyncHandler(async(req,res)=>{
    const {email} = req.body
    if(!email)
        return new ApiError(403 , 'Email is required for generating Otp')

    const otp = await Otp.generateOtp()

    const newOtp = await Otp.create({email , otp})

    return res.status(201).json(
        new ApiResponse(200 , 'Otp send generated successfully ' , newOtp)
    )
})

export {createOtp}