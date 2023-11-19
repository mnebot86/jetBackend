import { RequestHandler } from "express";
import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";

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

export const videosUpload: RequestHandler = async (req, res, next) => {
  const videos = req.files as Video[];

  if (videos?.length) {
    const cloudinaryResponses: Video[] = [];

	let count = 0;
	  
    try {
      for (const video of videos) {
		  
        const result = await cloudinary.uploader.upload(video.path, {
          resource_type: "video",
			public_id: `video/${video.originalname}-${count}`
		});

        cloudinaryResponses.push(result.playback_url);

        count++;
      }

		res.status(StatusCodes.OK).json(cloudinaryResponses);
    } catch (error) {
      console.error(error);
      next(error); 
    }
  }
};
