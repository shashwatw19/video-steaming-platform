import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import { Video } from '../models/video.model.js'

// get channels status( total comments , total likes , total views )
// *******pending******



// get get all the video uploaded by channel
const getAllVideosByChannel = asyncHandler(async(req , res)=>{
    const {channelId} = req.params.channelId || req.body.channelId

    const channel = await User.findById(channelId)
    if(!channel)
        throw new ApiError(404 , 'channel not found')

    const videos = await Video.find({owner : channelId} , {contentType : 'public'}).select('-owner')
    
    if(!videos)
        return res.status(201).json(
            new ApiResponse(200 , 'no videos found' , {videos : []})
        )
    return res.status(201).json(
        new ApiResponse(200 , 'videos fetched successfully' ,{videos})
    )
})

export {getAllVideosByChannel}