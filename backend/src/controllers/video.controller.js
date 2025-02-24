import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadImageOnCloudinary } from "../utils/cloudinary.js";

// get video based on the query , apply sorting and filters
const getVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', filters = {} } = req.query;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const query = {};
    if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
    }
    if (filters.contentType) {
        query.contentType = filters.contentType;
    }
    if (filters.isPublished !== undefined) {
        query.isPublished = filters.isPublished === 'true';
    }

    const videos = await Video.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalVideos = await Video.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, 'Videos fetched successfully', {
            videos,
            totalVideos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: page
        })
    );
});
// create a video
const createVideo = asyncHandler(async(req,res)=>{
    const {title , description  , duration , contentType , isPublished} = req.body

    
    if([title , description , videoUrl , duration , contentType , isPublished].includes(undefined)){
        throw new ApiError(400 , 'All fields are required')
    }

    const videoFile = req.files.video[0]?.path
    const thumbnail = req.files.thumbnail[0]?.path
    if(!videoFile){
        throw new ApiError(400 , 'video file is required')
    }
    if(!thumbnail){
        throw new ApiError(400 , 'thumbnail is required')
    }

    try {
        const uploadVideo = await uploadImageOnCloudinary(videoFile)
        const uploadThumbnail = await uploadImageOnCloudinary(thumbnail)
    } catch (error) {
        throw new ApiError(400 , 'error while uploading video' , error.message)
        
    }    
    const newVideo = await Video.create({
        title,
        description,
        videoUrl : uploadVideo?.secure_url,
        duration,
        contentType,
        owner : req.user._id,
        isPublished : isPublished || false,
        thumbnail : uploadThumbnail?.secure_url
    })

    if(!newVideo){
        throw new ApiError(400 , 'video not created')
    }

    return res.status(200).json(
        new ApiResponse(200 , 'video created successfully' , {newVideo})
    )
})
// get video by Id
const getVideoById = asyncHandler(async(req,res)=>{
    const videoId = req.params.videoId || req.body.videoId

    if(!videoId){
        throw new ApiError(400 , 'videoId is required')
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404 , 'video not found')
    }
    return res.status(200).json(
        new ApiResponse(200 , 'video fetched successfully ' , {video})
    )
})
// update video
const updateVideo = asyncHandler(async(req,res)=>{
    const videoId = req.params.videoId || req.body.videoId
    const {title , description , duration , contentType , isPublished} = req.body

    if(!videoId){
        throw new ApiError(400 , 'videoId is required')
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404 , 'video not found')
    }

    if( title && title !== video.title){
        video.title = title
    }
    if(description && description !== video.description)
        video.description = description
    
    if( video.isPublished !== isPublished)
        video.isPublished = isPublished
    
    if(video.contentType !== contentType)
        video.contentType = contentType


    return res.status(200).json(
        new ApiResponse(200 , 'video updated successfully' , {updatedVideo})
    )
})
// toggle publish status
const togglePublishStatus = asyncHandler(async(req,res)=>{
    const videoId = req.params.videoId || req.body.videoId

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404 , 'video not found')
    }

    video.isPublished = !video.isPublished
    video.save({ validateBeforeSave: false })

    return res.status(201).json(
        new ApiResponse(200 , 'video publish status toggled successfully' , {video})
    )
})
// delete video
const deleteVideo = asyncHandler(async(req,res)=>{
    const videoId = req.params.videoId || req.body.videoId

    const video = await Video.findByIdAndDelete(videoId)

    if(!video){
        throw new ApiError(404 , 'video not found')
    }
    
    return res.status(201).json(
        new ApiResponse(200 , 'video publish deleted successfully' , {video})
    )
})


export { getVideos , createVideo , getVideoById , updateVideo , togglePublishStatus , deleteVideo}