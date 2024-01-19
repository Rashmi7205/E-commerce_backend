
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
        let { category, limit, skip } = req.params;


        if (!limit) {
            limit = 20;
            skip = 0;
        }

        if (limit && (limit > 50 || limit < 0)) {
            return next(new AppError(401, "Invalid limit"));
        }

        const productList = await Product.aggregate([
            {
              '$skip': skip
            }, {
              '$limit': limit
            }, {
              '$match': {
                'category':category ||'Electronics'
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'owner', 
                'foreignField': '_id', 
                'as': 'owner'
              }
            }, {
              '$unwind': '$owner'
            }, {
              '$project': {
                'name': 1, 
                'description': 1, 
                'price': 1, 
                'quantity': 1, 
                'image_urls': 1, 
                'owner.username': 1, 
                'owner.email': 1, 
                'owner.profilePic': 1, 
                'createdAt': 1, 
                'updatedAt': 1
              }
            }
          ]);

          if(!productList.length){
            return next(new AppError(402,"There is no product"));
          }

          return res.status(200).json({
                success:true,
                message:"All the products fetched Successfully",
                productList
          });
    
    } catch (error) {
        return next(new AppError(500, "Internal Server Error"));
    }
}

const getOrders = async (req,res,next)=>{
    try {
        const {skip,limit,status} =req.body;

        
    } catch (error) {
      return next(new AppError(500, "Internal Server Error"));
    }
}

const getAllUsers = async (req,res,next)=>{
    try {
      
    } catch (error) {
      return next(new AppError(500, "Internal Server Error"));
    }
}



export {
    getAllProducts,
    getOrders,
};