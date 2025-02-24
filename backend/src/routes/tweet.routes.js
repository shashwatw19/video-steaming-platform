import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import {verifyJwt} from '../middlewares/auth.middleware.js'
import {createTweet , updateTweet , getTweetById , deleteTweet} from '../controllers/tweet.controller.js'

const router = Router()

router.route('/create-tweet').post(verifyJwt , createTweet)
router.route('/udpate-tweet/:id').patch(verifyJwt , updateTweet)
router.route('/tweet/:id').get(verifyJwt, getTweetById)
router.route('/delete-tweet/:id').delete(verifyJwt , deleteTweet)


export default router