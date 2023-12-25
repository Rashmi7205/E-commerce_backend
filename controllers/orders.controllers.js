import AppError from '../utils/apperror.js';
import {User,Order, Product} from '../models/index.js';

//get all the orders of the users 
const getOrders = async (req,res,next)=>{
    try {
        if(!req.user){
            return next(new AppError(401,"Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if(!userExist){
            return next(new AppError(402,"User doesnot exist"));
        }
        const userOrderList = await Order.find({user:req.user.id});

        for (const order of userOrderList || []) {
            for (const item of order.items) {
              const product = await Product.findById(item.product);
                item.product = product;
            }
          }
        
        return res.status(200).json({
            success:true,
            message:"Orders fetched successfully",
            userOrderList
        });
    } catch (error) {
        return next(new AppError(401,error.message))
    }
}

//place a new order
const placeOrders = async(req,res,next)=>{
    try {
        if(!req.user){
            return next(new AppError(401,"Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if(!userExist){
            return next(new AppError(402,"User doesnot exist"));
        }
        const {productId,quantity} = req.body;
        if(!productId || !quantity){
            return next(new AppError(401,"Productid and the quantity is required "));
        }
        const productExist = await Product.findById(productId);
        if(!productExist){
            return next(new AppError(401,"Missing product or this product has been removed"));
        }
        const newProduct = {
            product:productId,
            quantity,
        }

        const newOrder = await Order.create({
            user:req.user.id,
            total_amount:(productExist.price * quantity),
        });

        newOrder.items.push(newProduct);
        
        await newOrder.save();

        res.status(200).json({
            success:true,
            message:`${productExist.name} ordered successfully`,
            newOrder
        });
    } catch (error) {
        return next(new AppError(401,error.message))
    }
}

//get the order by id
const getOrderById = async (req,res,next)=>{
    try {
        if(!req.user){
            return next(new AppError(401,"Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if(!userExist){
            return next(new AppError(402,"User doesnot exist"));
        }

        const {orderId} = req.params;

        if(!orderId){
            return next(new AppError(401,"Missing Parameter : Orderid is required"));
        }

        const orderExist = await Order.findById(orderId);

        if(!orderExist){
            return next(new AppError(402,"This order Does not exist"));
        }
        
         for(const item of orderExist.items) {
            const product = await Product.findById(item.product);
            item.product = product;  
        };

        res.status(200).json({
            success:true,
            message:`Order details fetched successfully`,
            orderExist
        });

    } catch (error) {
        return next(new AppError(401,error.message))
    }
}

const cancelOrder = async (req,res,next)=>{
    try {

        if(!req.user){
            return next(new AppError(401,"Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if(!userExist){
            return next(new AppError(402,"User doesnot exist"));
        } 
        const {orderId,productId} = req.body;

        if(!orderId || !productId){
            return next(new AppError(401,"Missing Parameter | ordeeid and product id is required"));
        }
        const orderExist  = await Order.findById(orderId); 
        if(String(orderExist.user)!==req.user.id){
            return next(new AppError(401,"Unauthenticated user"));
        }
        const findProdductIndex = orderExist.items.findIndex((item)=>String(item.product)===productId);
        if(findProdductIndex === -1){
            return next(new AppError(402,"This product is missing"));
        }
        orderExist.items.splice(findProdductIndex,1);


        if(!orderExist.items.length){
            orderExist.status="Canceled";
        }
        return res.status(200).json({   
            success:true,
            message:'Order canceled successfully'
        });

    } catch (error) {
        return next(new AppError(401,error.message))
    }
}

export {
    getOrderById,
    getOrders,
    placeOrders,
    cancelOrder
}
