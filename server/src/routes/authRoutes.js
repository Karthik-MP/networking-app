import express from 'express';
import { loginUser, signUpUser } from '../controllers/authController.js';

const authRouter = express.Router();
authRouter.post('/signup', signUpUser);  
authRouter.post('/login', loginUser);  


export default authRouter;