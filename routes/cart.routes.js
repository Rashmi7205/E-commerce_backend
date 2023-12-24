import { Router } from "express";
import isLoggedIn from '../middlewares/auth.middleware.js';
import {getCartItems,addItemsToCart,updateCartItems,deleteCartItem} from '../controllers/cart.controllers.js'

const router = Router();

router.route('/')
    .get(isLoggedIn,getCartItems)
    .post(isLoggedIn,addItemsToCart)
    .put(isLoggedIn,updateCartItems)
    .delete(isLoggedIn,deleteCartItem);

export default router;