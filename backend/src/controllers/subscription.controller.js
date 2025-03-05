import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
// toggle subscription
const toggleSubscription = asyncHandler(async(req,res)=>{
    
    const { channelId } = req.params || req.body

    if(!channelId)
        throw new ApiError(400 , 'channel id is required!')

    const isSubscribed = await Subscription.findOne({channel : channelId , subscriber : req.user?._id})

    if(!isSubscribed){
        const newSubscription = await Subscription.create({
            channel : channelId,
            subscriber : req.user._id
        })

        if(!newSubscription)
            throw new ApiError(400 , 'error while subscribing to channel')

        return res.status(201).json(
            new ApiResponse(200 , 'subscribed!!' , newSubscription)
        )
    }else{
        const unSubscribe = await Subscription.findOneAndDelete({channel : channelId , subscriber : req.user?._id})

        if(!unSubscribe)
            throw new ApiError(400 , 'unable to unsubscribe channel')

        return res.status(200).json(
            new ApiResponse(200 , 'unsubscribed' , unSubscribe)
        )

    }


})
// controller to return subscriber list of a channel
const getSubscribers = asyncHandler(async(req,res)=>{
    const { channelId } = req.params

    if(!channelId)
        throw new ApiError(400 , 'channel id is required!')

    const subscribers = await Subscription.find({channel : channelId}).populate('subscriber')

    if(!subscribers)
        return res.status(200).json(
            new ApiResponse(200 , ' no subscribers found!' , subscribers)
        )

    return res.status(200).json(
        new ApiResponse(200 , 'subscribers found!' , subscribers)
    )
})
// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async(req,res)=>{
    
    const subscribedChannels = await Subscription.find({subscriber : req.user._id}).populate('channel')

    if(!subscribedChannels)
        return res.status(200).json(
            new ApiResponse(200 , 'no subscribed channels' ,[])
        )
    return res.status(201).json(
        new ApiResponse(200 , subscribedChannels?.length + ' subscribed channels found!' , subscribedChannels) 
    )
})
export {toggleSubscription , getSubscribers , getSubscribedChannels}