import express from 'express';
import { signUpUser } from '../controllers/authController.js';

const authRouter = express.Router();
authRouter.post('/signup', signUpUser); 


export default authRouter;