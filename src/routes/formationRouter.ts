import express from 'express';
import * as FormationController from '../controllers/formationController'
import { requireAuth } from '../middleware/checkAuth';
import { setupMulter } from '../utils/muter';

const router = express.Router({ mergeParams: true });

const uploads = setupMulter();

router.route('/')
	.post(uploads.single('formation_picture'), requireAuth, FormationController.createFormation)
	.get(requireAuth, FormationController.getAllFormations);

router.route('/:id')
	.get(requireAuth, FormationController.getFormation)
	.patch(uploads.single('formation_picture'), requireAuth, FormationController.updateFormation)
	.delete(requireAuth, FormationController.deleteFormation);

export default router;
