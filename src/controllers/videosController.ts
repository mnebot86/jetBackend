import { v2 as cloudinary } from "cloudinary";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { io } from "../app";
import GameFilm from "../models/gameFilm";
import Video from "../models/video";
import { initializeCloudinary } from "../utils/cloudinary";

interface Video {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
}

interface Comment {
  comment: String,
  playerTags: string[],
  createdBy: string
}

interface VideoModel {
  _id: string;
  url: string,
  comments?: Comment[],
}

initializeCloudinary();

export const videosUpload: RequestHandler = async (req, res, next) => {
  const { gameFilmId } = req.params;
  const { team, year } = req.body;

  const videoUrls: string[] = [];
  
  try {
    await Promise.all(
      (req.files as Express.Multer.File[]).map((file) => {
        return new Promise<void>((resolve, reject) => {
          cloudinary.uploader.upload_large(
            file.path,
            { resource_type: "video", tags: [team, year], folder: 'gameFilm' },
            (error, result) => {
              if (error) {
                console.error(`Cloudinary Upload Error:`, error);
                reject(error);
              } else {
                console.log(result);
                if (result && result.secure_url) {
                  videoUrls.push(result.playback_url);
                }
                resolve();
              }
            }
          );
        });
      })
    );
    
    const videoModelsPromises: Promise<VideoModel>[] = videoUrls.map(async (url) => {
      const newVideoModelDocument = await Video.create({
        url,
        comments: [],
      });
    
      const newVideoModel: VideoModel = newVideoModelDocument.toObject();
    
      return newVideoModel;
    });

    const resolvedVideoModels = await Promise.all(videoModelsPromises);

    const gameFilm = await GameFilm.findByIdAndUpdate(
      gameFilmId,
      {
        $push: { videos: { $each: resolvedVideoModels } },
      },
      {
        new: true,
      }
    ).populate('videos');;
    
    io.emit('video_upload', gameFilm?.videos);
    
    res.status(StatusCodes.OK).json(gameFilm);
  } catch (error) {
    console.error(`ERROR`, error);
    next(error);
  }
};
