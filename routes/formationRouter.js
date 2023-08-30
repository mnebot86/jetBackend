import express from 'express';
import { createFormation, getAllFormations, getFormation, updateFormation, deleteFormation } from '../controllers/formationController.js';
import { checkAuth } from '../middleware/authenticated.js';
import { setupMulter } from '../utils/muter.js'

const router = express.Router({ mergeParams: true });

const uploads = setupMulter();

router.route('/').post(uploads.single('formation_picture'), checkAuth, createFormation).get(checkAuth, getAllFormations);
router.route('/:id').get(checkAuth, getFormation).patch(uploads.single('formation_picture'), checkAuth, updateFormation).delete(checkAuth, deleteFormation);

export default router;
