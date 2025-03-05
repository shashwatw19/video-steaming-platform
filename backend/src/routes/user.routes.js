import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJwt} from '../middlewares/auth.middleware.js'
import {
    signUp ,
    signIn ,
    logout ,
    forgotPassword ,
    resetPassword ,
    updatePassword ,
    updateAvatarImage ,
    updateCoverImage ,
    updateProfile,
    getUserChannelDetails ,
    getWatchHistory , 
    refresAccessToken ,
    getCurrentUser
}
    from "../controllers/user.controller.js";
import { createOtp } from "../controllers/otp.controller.js";
const router = Router()


router.route('/signup').post(upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]),signUp)

router.route('/signin').post(signIn)
router.route('/create-otp').post(createOtp)


// secured routes
router.route('/logout').post(verifyJwt , logout)
router.route('refresh-token').post(refresAccessToken)
router.route("/change-password").post(verifyJwt, updatePassword)
router.route("/current-user").get(verifyJwt, getCurrentUser)
router.route("/update-account").patch(verifyJwt, updateProfile)

router.route("/update-avatar").patch(verifyJwt, upload.single("avatar"), updateAvatarImage)
router.route("/update-cover-image").patch(verifyJwt, upload.single("coverImage"), updateCoverImage)

router.route("/channel/:username").get(verifyJwt, getUserChannelDetails)
router.route("/history").get(verifyJwt, getWatchHistory)

router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)

export default router