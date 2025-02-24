import { Router } from 'express';
import {
    getAllVideosByChannel , getChannelStatus
} from "../controllers/dashboard.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStatus);
router.route("/videos").get(getAllVideosByChannel);

export default router