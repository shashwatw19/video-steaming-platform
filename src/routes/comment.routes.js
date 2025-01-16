import { Router } from 'express';
import { verifyJwt } from '../middlewares/auth.middleware.js';
import {
    getVideoComments, createComments, updateComments, deleteComments 
} from "../controllers/comment.controller.js"


const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/u/:videoId").get(getVideoComments).post(createComments);
router.route("/c/:commentId").delete(deleteComments).patch(updateComments);

export default router