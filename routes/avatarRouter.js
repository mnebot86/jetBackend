import express from 'express';
import { createAvatar } from '../controllers/avatarController.js';
import multer from 'multer';
import { checkAuth } from '../middleware/authenticated.js';

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb('invalid image file', false);
	}
};

const uploads = multer({ storage, fileFilter });

const router = express.Router();

router.route('/').post(uploads.single('avatar'), checkAuth, createAvatar);

export default router;
