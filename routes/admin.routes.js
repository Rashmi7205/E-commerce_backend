import { Router } from "express";
import  { isAdmin } from "../middlewares/auth.middleware.js";
import { getAllProducts, getAllUsers } from "../controllers/admin.controllers.js";
import {addProduct,updateProductById,removeProductById,getProductById} from '../controllers/product.controllers.js';

const router = Router();


router.route('users')
    .get(isAdmin,getAllUsers)

router.route('/products')
    .get(isAdmin,getAllProducts)
    .post(isAdmin,addProduct);
router.route('/products/:id')
        .get(isAdmin,getProductById)
        .put(isAdmin,updateProductById)
        .delete(isAdmin,removeProductById);


export default router;