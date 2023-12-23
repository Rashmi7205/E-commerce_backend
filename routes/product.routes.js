import { Router } from "express";
import isLoggedIn from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

import {  getProduct,
    getProductById,
    updateProductById,
    removeProductById,
    getProductCatagories,
    addProduct} from '../controllers/product.controllers.js';

const router = Router();

router.
    route('/products/:catagory/:limit/:skip')
    .get(getProduct);

router.post('/add',isLoggedIn,upload.array('image_urls',5),addProduct);

router.route('/products/:id')
    .get(getProductById)
    .put(isLoggedIn,updateProductById)
    .delete(isLoggedIn,removeProductById)

export default router;