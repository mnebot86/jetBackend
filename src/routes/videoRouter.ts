import express from "express";
import * as VideoController from "../controllers/videosController";
import { requireAuth } from "../middleware/checkAuth";
import { setupMulter } from "../utils/muter";

const uploads = setupMulter();

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(uploads.array("videos", 20), requireAuth, VideoController.videosUpload);
  
router.route("/:videoId").post(VideoController.addVideoComment);
export default router;
