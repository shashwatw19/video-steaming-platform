import { Router } from 'express';
import {
    createPlayList , getAllPlaylistByUser , getPlayListById , addVideoToPlaylist , removeVideoFromPlaylist , deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create-playlist").post(createPlayList)

router
    .route("/:playlistId")
    .get(getPlayListById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getAllPlaylistByUser);

export default router