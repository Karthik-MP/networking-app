import express from 'express';
import { updateUserProfile, getUserProfile } from '../controllers/userController.js';

const router = express.Router();
// router.post('/update', updateUserProfile); 
// router.get('/:id', getUserProfile);

export default router;
