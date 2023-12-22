import { Router } from "express";
import {registerUser,login,logout,forgotPassword,resetPassword, updateUser} from '../controllers/auth.controllers.js';
import isLoggedIn from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();


router.post('/register',registerUser);
router.post('/login',login);
router.post('/logout',isLoggedIn,logout);
router.post('/reset-password ',resetPassword);
router.post('/update-user',isLoggedIn,upload.single('profilePic'),updateUser);

export default router;