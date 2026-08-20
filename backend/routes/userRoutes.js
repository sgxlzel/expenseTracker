import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {registerUser, loginUser,getUserDetails, changeUserPassword, updateUserProfile, } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';



const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//protected route
userRouter.get("/me",authMiddleware, getUserDetails);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.put("/password", authMiddleware, changeUserPassword);

export default userRouter;