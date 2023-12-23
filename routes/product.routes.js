import { Router } from "express";
import isLoggedIn from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

import {  getProduct,
    getProductById,
    updateProductById,
    removeProductById,
    getProductCatagories,
    addProduct,
    getMyProduct} from '../controllers/product.controllers.js';

const router = Router();

// public routes
router.
    route('/:catagory/:limit/:skip') 
    .get(getProduct);
router.get('/catagories',getProductCatagories);

//protected routes
//add product
router.post('/add',isLoggedIn,upload.array('image_urls',5),addProduct);

//get user products 
router.route('/my-products')
        .get(isLoggedIn,getMyProduct);

router.route('/:id')
    .get(getProductById) // get a specific product by id
    .put(isLoggedIn,updateProductById) // update a product by id
    .delete(isLoggedIn,removeProductById) // delete a product by id


export default router;