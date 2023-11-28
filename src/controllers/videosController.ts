import { RequestHandler } from "express";
import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";
import GameFilm from "../models/gameFilm";
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

interface CloudindaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  playback_url: string;
  folder: string;
  audio: any;
  video: {
    pix_format: string;
    codec: string;
    level: number;
    profile: string;
    bit_rate: string;
    time_base: string;
  };
  frame_rate: number;
  bit_rate: number;
  duration: number;
  rotation: number;
  original_filename: string;
  nb_frames: number;
  api_key: string;
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
            { resource_type: "video", chunk_size: 10485760, tags: [team, year] },
            (error, result) => {
              if (error) {
                console.error(`Cloudinary Upload Error:`, error);
                reject(error);
              } else {
                console.log(result);
                if (result && result.secure_url) {
                  videoUrls.push(result.secure_url);
                }
                resolve();
              }
            }
          );
        });
      })
    );

    const gameFilm = await GameFilm.findByIdAndUpdate(
      gameFilmId,
      {
        $push: { videos: { $each: videoUrls } },
      },
      {
        new: true,
      }
    );

    res.status(StatusCodes.OK).json(gameFilm);
  } catch (error) {
    console.error(`ERROR`, error);
    next(error);
  }
};
