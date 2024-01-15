import { Router } from "express";
import  { isAdmin } from "../middlewares/auth.middleware.js";
import { getAllProducts } from "../controllers/admin.controllers.js";

const router = Router();

router.route('/products')
    .get(isAdmin,getAllProducts)
    .post(isAdmin)