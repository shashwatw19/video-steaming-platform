import { Router } from 'express';
import {
    getVideos , createVideo , getVideoById , updateVideo , togglePublishStatus , deleteVideo
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getVideos)
    
router.post('/upload' , upload.fields([
    { name : 'thumnail ' , maxCount : 1},
    {name : videoFile , maxCount : 1}
]) , createVideo)

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router