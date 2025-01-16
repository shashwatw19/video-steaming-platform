import { Router } from 'express';
import {
    toggleVideoLike , toggleTweetLike , toogleCommentLike , getLikedVideo , getLikedTweet
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toogleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos-liked").get(getLikedVideo);
router.route('/tweets-liked').get(getLikedTweet);

export default router