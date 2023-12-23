import { Router } from "express";
import {registerUser,login,logout,forgotPassword,resetPassword, updateUser, updateUserAddress} from '../controllers/auth.controllers.js';
import isLoggedIn from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();


router.post('/register',registerUser);
router.post('/login',login);
router.post('/logout',isLoggedIn,logout);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:resetPasswordToken',resetPassword);
router.post('/update-user',isLoggedIn,upload.single('profilePic'),updateUser);
router.post('/update-user-address',isLoggedIn,updateUserAddress);

export default router;