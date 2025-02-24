import {Router} from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js'
import { getSubscribedChannels, toggleSubscription, getSubscribedChannels } from '../controllers/subscription.controller.js'
const router = Router()
router.use(verifyJwt)

router
    .route("/channel/:channelId")
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.route("/channel/:subscriberId").get(getSubscribedChannels);

export default router