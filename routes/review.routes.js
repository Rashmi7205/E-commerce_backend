import { Router } from "express";
import isLoggedIn from "../middlewares/auth.middleware.js";
import {postReview} from '../controllers/review.controllers.js';

const router = Router();

router.post('/post',isLoggedIn,postReview);

export default router;
