import {Playlist} from '../models/playlist.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {Video} from '../models/video.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'
// create playlist
const createPlayList = asyncHandler(async(req,res)=>{
    const {name , description , videoId} = req.body

    if(videoId){
        const video = await Video.findById(videoId)
        if(!video)
            throw new ApiError( 404 , 'video not found')
    }
        
    const newPlaylist = await Playlist.create({
        name , 
        description : description ? description : null,
        videos : videoId ? videoId : null,
        owner : req.user._id
    })

    if(!newPlaylist){
        throw new ApiError(403 , 'Error while creating playList')
    }

    return res.status(201).json(
        new ApiResponse(200 , 'Playlist created successfully' , newPlaylist)
    )

})
// get playlist by userId
const getAllPlaylistByUser = asyncHandler(async(req,res)=>{

    const playListByUser = await Playlist.find({},{owner : req.user._id})

    if(!playListByUser)
        return res.status(201).json(
            new ApiResponse(200 , 'no playList found')
        )      

    return res.status(200).json(
        new ApiResponse(200 , 'playlist created by user' , playListByUser)
    )

})
// get playlist by playlistId
const getPlayListById = asyncHandler(async(req,res)=>{
    const {playListId} = req.body

    if(!playListId)
        throw new ApiError(404 , 'playList Id not found')

    const playList = await Playlist.findById(playListId)

    if(!playList)
        throw new ApiError(403 , 'not able to find playlist')

    return res.status(201).json(
        new ApiResponse(200 , 'playlist fetched' , playList)
    )
})
// add video to playList
const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const {playListId , videoId} = req.body

    if([playListId , videoId].some((field)=>field.trim() === ''))
        throw new ApiError(403 , 'playListId & videoId required')

    const video = await Video.findById(videoId)
    if(!video)
        throw new ApiError(404 , 'video not found')
    
    const playlist = await Playlist.findById(playListId)
    if(!playlist)
        throw new ApiError(404 , 'playList not found')

    playlist.videos.push(videoId)

    await playlist.save({validateBeforeSave : false})

    return res.status(200).json(
        new ApiResponse(200 , 'video added to playlist' , 
            { 
                name : playlist.name,
                videos : playlist.videos 
            }))

})
// remove video from playList
const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playListId , videoId} = req.body

    if([playListId , videoId].some((field)=>field.trim() === ''))
        throw new ApiError(403 , 'playListId & videoId required')

    const video = await Video.findById(videoId)
    if(!video)
        throw new ApiError(404 , 'video not found')
    
    const playlist = await Playlist.findById(playListId)
    if(!playlist)
        throw new ApiError(404 , 'playList not found')

    const remainingVideo = playlist.videos.filter((vid)=>vid!=videoId)

    playlist.videos = remainingVideo

    await playlist.save({validateBeforeSave : false})

    return res.status(200).json(
        new ApiResponse(200 , 'video added to playlist' , 
            { 
                name : playlist.name,
                videos : playlist.videos 
            }))

})

export {createPlayList , getAllPlaylistByUser , getPlayListById , addVideoToPlaylist , removeVideoFromPlaylist}