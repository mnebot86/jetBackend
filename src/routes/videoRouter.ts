import express from "express";
import * as VideoController from "../controllers/videosController";
import { requireAuth } from "../middleware/checkAuth";
import { setupMulter } from "../utils/muter";

const uploads = setupMulter();

const router = express.Router();

router
  .route("/upload")
  .post(uploads.array("videos"), requireAuth, VideoController.videosUpload);

export default router;
