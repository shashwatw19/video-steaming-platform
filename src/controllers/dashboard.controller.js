import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import { Video } from '../models/video.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'

// get channels status( total video , total subscribers , total views , total likes , total comment)

const getChannelStatus = asyncHandler(async(req,res)=>{
    const {channelId} = req.params || req.body.channelId

    if(!channelId)
        throw new ApiError(400 , 'channel id is required!')

    const channelStatus = await User.aggretate([
        // matching channel id
        {
            $match : {
                _id : channelId
            }
        },
        // lookup for videos
        {
            $lookup : {
                from : 'videos',
                localField : '_id',
                foreignField : 'owner',
                as : 'totalVideos',
            }
        },
        // lookup for subscribers
        {
            $lookup : {
                from : 'subscribers',
                localField : '_id',
                foreignField : 'channel',
                as  : 'totalSubscribers'
            }
        },
        // lookup for tweets
        {
            $lookup : {
                from : 'tweet',
                localFeild : '_id',
                foreignField : 'owner',
                as : 'totalTweets'
            }
        },
        // lookup for likes on videos
        {
            $lookup : {
                from : 'likes',
                localField : '_id',
                foreignField : 'video',
                as : 'totalLikesOnVideos'
            }
        },
        // lookup for likes on tweets
        {
            $lookup : {
                from : 'likes',
                localField : '_id',
                foreignField : 'tweet',
                as : 'totalLikesOnTweets'
            }
        },
        // lookup for comments on videos
        {
            $lookup : {
                from : 'comments',
                localField : '_id',
                foreignField : 'video',
                as : 'totalCommentsOnVideos'
            }
        },
        // lookup for comments on tweets
        {
            $lookup : {
                from : 'comments',
                localField : '_id',
                foreignField : 'tweet',
                as : 'totalCommentsOnTweets'
            }
        },
        {
            $lookup : {
                from : 'profile',
                localField : 'additionalDetails',
                foreignField : 'channel',
                as : 'otherDetails'
            }
        },
        {
            $addFields : {
                totalVideos : {
                    $size : '$totalVideos'
                },
                totalSubscribers : {
                    $size : '$totalSubscribers'
                },
                totalTweets : {
                    $size : '$totalTweets'
                },
                totalLikesOnVideos : {
                    $size : '$totalLikesOnVideos'
                },
                totalLikesOnTweets : {
                    $size : '$totalLikesOnTweets'
                },
                totalCommentsOnVideos : {
                    $size : '$totalCommentsOnVideos'
                },
                totalCommentsOnTweets : {
                    $size : '$totalCommentsOnTweets'
                },
                totalViews : {
                    $sum : '$totalVideos.views'
                },
                totalPublishedVideos : {
                    $sum : {
                        $cond : {
                            if : {$eq : ['$totalVideos.isPublished' , true]},
                            then : 1,
                            else : 0
                        }
                    }
                },
                totalUnPublishedVideos : {
                    $sum : {
                        $cond : {
                            if : {$eq : ['$totalVideos.isPublished' , false]},
                            then : 1 ,
                            else : 0
                        }
                    }
                },
                
                channelDescription : '$otherDetails.bio',
                
                socialLinks : '$otherDetails.social',
            }
        },
        {
            $project : {
                totalVideos : 1,
                totalSubscribers : 1,
                totalTweets : 1,
                totalLikesOnVideos : 1,
                totalLikesOnTweets : 1,
                totalCommentsOnVideos : 1,
                totalCommentsOnTweets : 1,
                totalViews : 1,
                totalPublishedVideos : 1,
                totalUnPublishedVideos : 1,
                avatar : 1,
                coverImage : 1,
                channelDescription : 1,
                socialLinks : 1,
            }
        }   

    ])

    if(!channelStatus?.length)
        return new ApiError(400 , 'channel status not found' , )
    
    return res.status(201).json(
        new ApiResponse(200 , 'channel status fetched successfully' , channelStatus[0])
    )
})


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

export {getAllVideosByChannel , getChannelStatus}