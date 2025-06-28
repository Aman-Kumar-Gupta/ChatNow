import express from 'express';
import { checkAuth, login, signUp, updateProfile } from '../controllers/userController.js';
import { protectRoutes } from '../middleware/auth.js';

const userRouter= express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login);
userRouter.put('/update-profile', protectRoutes,updateProfile);
userRouter.get('/check', protectRoutes,checkAuth);

export default userRouter;