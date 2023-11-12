import express from "express";
import * as AvatarController from "../controllers/avatarController";
import { requireAuth } from "../middleware/checkAuth";
import { setupMulter } from "../utils/muter";

const uploads = setupMulter();

const router = express.Router();

router
  .route("/")
  .post(uploads.single("avatar"), requireAuth, AvatarController.createAvatar);

router.route("/:imageId").delete(requireAuth, AvatarController.deleteAvatar);

export default router;
