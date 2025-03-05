import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from '../utils/ApiError.js'
import {Comment} from '../models/comment.model.js'
import {Video} from '../models/video.model.js'
// get comments
const getVideoComments = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404 , 'video not found')
    }
    const comments = await Comment.find({ video: videoId })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

    if (!comments) {
        return res.status(201).json(
            new ApiResponse(200 , 'no comments found on this video' , {comments : []})
        )
    }

    return res.status(200).json(
        new ApiResponse(200 , 'comments fetched successfully' , {comments})
    );
    
})
// create comments
const createComments = asyncHandler(async(req,res)=>{
    const {content} = req.body
    const videoId = req.params.videoId || req.body.videoId

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404 , 'video not found')
    }

    const newComment = await Comment.create({
        content,
        owner : req.user._id,
        video : videoId
    })

    if(!newComment){
        throw new ApiError(400 , 'comment not created')
    }

    return res.status(201).json(
        new ApiResponse(201 , 'comment created successfully' , {newComment})
    )
})
// update comments
const updateComments = asyncHandler(async(req, res)=>{
    const {content , commentId} = req.body

    const updatedComment = await findOneAndUpdate({_id : commentId} , 
        {content : content} ,
        {new : true})

    if(!updatedComment){
        throw new ApiError(400 , 'comment not updated')
    }

    return res.status(201).json(
        new ApiResponse(200 , 'comment updated successfully' , {updatedComment})
    )
})
// delete comments
const deleteComments = asyncHandler(async(req,res)=>{
    const {commentId} = req.body

    const deletedComment = await Comment.findOneAndDelete({_id : commentId})

    if(!deletedComment){
        throw new ApiError(400 , 'comment not deleted')
    }
    return res.status(201).json(
        new ApiResponse(200 , 'comment deleted successfully' , {deletedComment})
    )
})

export { getVideoComments, createComments, updateComments, deleteComments }