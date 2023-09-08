import multer from 'multer';

export const setupMulter = () => {
	const storage = multer.diskStorage({});

	const fileFilter = (req, file, cb) => {
		if (file.mimetype.startsWith('image')) {
			cb(null, true);
		} else {
			cb(new Error('Invalid image file'), false);
		}
	};

	return multer({ storage, fileFilter });
};
