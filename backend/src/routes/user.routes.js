import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
const router = Router()


router.post(upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]))

export default router