import {Tweet} from '../models/tweet.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
// create tweet
const createTweet = asyncHandler(async(req,res)=>{
    const {content} = req.body
    if(!content)
        throw new ApiError(403 , 'Content is required')

    const imageUrls = Array.isArray() ? req.files.imageUrls.map(file => file.path) : []

    const newTweet = await Tweet.create({
        content,
        imageUrls,
        owner : req.user._id
    })

    if(!newTweet)
        throw new ApiError(403 , 'Error while creating tweet')

    return res.status(201).json(
        new ApiResponse(200 , 'tweet created succesfully' , newTweet)
    )

})
// update
const updateTweet = asyncHandler(async(req,res)=>{
    const tweetId = req.params.id
    const {content} = req.body

    const imageUrls = Array.isArray(req.files.imageUrls) ? req.files.imageUrls.map(file => file.path) : []

    const tweet = await Tweet.findById(tweetId)

    if(!tweet)
        throw new ApiError(404 , 'Tweet not found')

    if(content)
        tweet.content = content
    if(imageUrls.length > 0)
        tweet.imageUrls = imageUrls

    await tweet.save()

    return res.status(200).json(
        new ApiResponse(200 , 'Tweet updated successfully' , tweet)
    )
})
// get
const getTweetById = asyncHandler(async(req,res)=>{
    
    const tweetId = req.params.id

    if(!tweetId)
        throw new ApiError(403 , 'Tweet id is required')

    const findTweet = await Tweet.findById(tweetId)

    if(!findTweet)
        throw new ApiError(404 , 'tweet not found')

    return res.status(200).json(
        new ApiResponse(200 , 'Tweet fetched succesfully' , findTweet)
    )
})
// delete
const deleteTweet = asyncHandler(async(req,res)=>{
    const tweetId = req.body.tweetId || req.params.id

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if(!tweet)
        throw new ApiError(402 , 'tweet with this id not found')

    return res.status(200).json(
        new ApiResponse(200 , 'tweet deleted successfully' , tweet)
    )

})

export {createTweet , updateTweet , getTweetById , deleteTweet}