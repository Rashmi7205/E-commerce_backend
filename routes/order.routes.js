import e, { Router } from "express";
import {getOrders,getOrderById,placeOrders,cancelOrder} from '../controllers/orders.controllers.js';
import isLoggedIn from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/')
        .get(isLoggedIn,getOrders)
        .post(isLoggedIn,placeOrders);
router.route('/:orderId')
        .get(isLoggedIn,getOrderById);
router.route('/')
        .post(isLoggedIn,cancelOrder);
export default router;