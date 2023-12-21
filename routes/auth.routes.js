import { Router } from "express";
import {registerUser,login,logout,forgotPassword,resetPassword} from '../controllers/auth.controllers.js';
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = Router();


router.post('/register',registerUser);
router.post('/login',login);
router.post('/logout',isLoggedIn,logout);
router.post('/reset-password ',resetPassword);

export default router;