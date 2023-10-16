import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

export const setupMulter = () => {
	const storage = multer.diskStorage({});

	const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
		if (file.mimetype.startsWith('image')) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	};

	return multer({ storage, fileFilter });
};
