import {Video} from '../models/video.model.js'
import {Tweet} from '../models/tweet.models.js'
import { Like } from '../models/likes.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
// toggle video like
const toggleVideoLike = asyncHandler(async(req , res)=>{
    const videoId = req.body.videoId
    
    const video = await Video.findById(videoId)
    if(!video)
        throw new ApiError(404 , 'video not found')
    
    const likeHistory = await Like.findOne({likedBy : req.user._id})

    if(!likeHistory){
        await Like.create({
            video : [videoId],
            likedBy : req.user._id
        })
    }else{
        const isLiked = likeHistory.video.includes(videoId);
        if (isLiked) {
            // Remove the video ID from the array
            await Like.updateOne(
                {likedBy : req.user._id},
                {$pull : {video : videoId}}
            )
        }else {
            // Add the video ID to the array
           await Like.updateOne(
            { likedBy : req.user._id},
            {$push : {video : videoId}}
           )
        }
    }
    
    await likeHistory.save({ validateBeforeSave: false });
       
    return res.status(201).json(
        new ApiResponse(200 , 'video liked toggled successfully' , { newLikeHistory : likeHistory.video})
    )
})
// toggle tweet like
const toggleTweetLike = asyncHandler(async(req,res)=>{
    const tweetId = req.body.tweetId || req.params.tweetId

    const tweet = await Tweet.findOne({_id : tweetId})
    if(!tweet)
        return ApiError(403 , 'tweet not found')

    const likedHistory = await Like.findOnee({likedBy : req.user._id})

    if(!likedHistory){
        await Like.create({
            tweet : [tweetId],
            likedBy : req.user._id
        })
    }else{
        const isLiked = likedHistory.tweet.includes(tweetId)
        // if tweet is liked then remove it liked history
        if(isLiked){
            await Like.updateOne({likedBy : req.user._id},
                {$pull : {tweet : tweetId}})
        }else{
            await Like.updateOne({likedBy : req.user._id},
                { $push : {tweet : tweetId}})
        }
    }
    await likedHistory.save({ validateBeforeSave: false });

    return res.status(201).json(
         new ApiResponse(200 , 'tweet liked toggled succesfully ' , {newLikeHistory : likedHistory.tweet})
    )
})
// toggle comment like
const toogleCommentLike = asyncHandler(async(rqe,res)=>{
    const commentId = req.body.commentId || req.params.commentId

    const comment = await Tweet.findOne({_id : commentId})
    if(!comment)
        return ApiError(403 , 'tweet not found')

    const likedHistory = await Like.findOnee({likedBy : req.user._id})

    if(!likedHistory){
        await Like.create({
            comment : [commentId],
            likedBy : req.user._id
        })
    }else{
        const isLiked = likedHistory.comment.includes(commentId)
        // if tweet is liked then remove it liked history
        if(isLiked){
            await Like.updateOne({likedBy : req.user._id},
                {$pull : {comment : commentId}})
        }else{
            await Like.updateOne({likedBy : req.user._id},
                { $push : {comment : commentId}})
        }
    }
    await likedHistory.save({ validateBeforeSave: false });

    return res.status(201).json(
         new ApiResponse(200 , 'tweet liked toggled succesfully ' , {newLikeHistory : likedHistory.comment})
    )
})
// get liked video
const getLikedVideo = asyncHandler(async(req,res)=>{
    const likedHistory = await Like.findOne({likedBy : req.user._id})

    if(!likedHistory)
        return res.status(200).json(new ApiResponse(200 , 'liked videos' , {videos : []}))
    else{
        return res.status(200).json(
            new ApiResponse(200 , 'liked videos' , {likedVideos : likedHistory.video})
        )
    }
})
// get liked tweet
const getLikedTweet = asyncHandler(async(req,res)=>{
    const likedHistory = await Like.findOne({likedBy : req.user._id})

    if(!likedHistory)
        return res.status(200).json(new ApiResponse(200 , 'liked tweet' , {tweet : []}))
    else{
        return res.status(200).json(
            new ApiResponse(200 , 'liked tweet' , {likedTweet : likedHistory.tweet})
        )
    }
})

export {toggleVideoLike , toggleTweetLike , toogleCommentLike , getLikedVideo , getLikedTweet}