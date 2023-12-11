import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
import { initializeCloudinary } from "../utils/cloudinary";
import { RequestHandler } from "express";

initializeCloudinary();

export const createAvatar: RequestHandler = async (req, res, next) => {
  const { uniqueId } = req.body;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `avatar/${uniqueId}`,
        crop: "fill",
      });

      res.status(StatusCodes.OK).json({
        url: result.secure_url,
        imageId: uniqueId,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAvatar: RequestHandler = async (req, res, next) => {
  const { imageId } = req.params;

  try {
    const deletionResult = await cloudinary.uploader.destroy(
      `avatar/${imageId}`
    );

    if (deletionResult.result === "ok") {
      res.sendStatus(StatusCodes.OK);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: "Avatar not found" });
    }
  } catch (error) {
    next(error);
  }
};
