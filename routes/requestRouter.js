import express from 'express';
import {
	sendRequest,
	handleRequest,
} from '../controllers/requestController.js';

const router = express.Router();

router.route('/send').post(sendRequest);
router.route('/handle-request').post(handleRequest);

export default router;
