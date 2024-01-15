
import {User,Product,Order} from '../models/index.js';
import AppError from '../utils/apperror.js';

// GET /api/admin/products:
// Fetch a list of all products.
const getAllProducts = async(req,res,next)=>{
    try {
        if(!req.user){
            return next(new AppError(401,"Unauthenticated access"));
        }
        // Provide options for pagination, sorting, and 
        let { catagory, limit, skip } = req.params;

        if (!limit) {
            limit = 20;
            skip = 0;
        }

        if (limit && (limit > 50 || limit < 0)) {
            return next(new AppError(401, "Invalid limit"));
        }

       

    } catch (error) {
        return next(new AppError(500, "Internal Server Error"));
    }
}
/*  @POST /api/admin/products:*/

// Add a new product to the system.
// Validate and sanitize input data.
// Handle file uploads if product images are part of the data.
const createProduct = async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}

const getProductById = async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}

const updateProductById = async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}

const deleteProductById = async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}

const getOrders = async (req,res,next)=>{
    try {
        
    } catch (error) {
        
    }
}



export {
    getAllProducts,
    createProduct,
    updateProductById,
    deleteProductById,
    getProductById,
    getOrders,

};