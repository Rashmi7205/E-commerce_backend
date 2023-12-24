import { User, Product, Cart } from "../models/index.js";
import AppError from "../utils/apperror.js";

//get cart items
const getCartItems = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if (!userExist) {
            return next(new AppError(402, "User does not exist"));
        }
        const cartItemList = await Cart.find({ user: req.user.id });

        if (!cartItemList.length) {
            return next(new AppError(402, "Your cart is empty"));
        }
        return res.status(200).json({
            success: true,
            message: "Your cart item fetched successfully",
            cartItemList
        });

    } catch (error) {
        return next(new AppError(401, error.message));
    }
}
// add to cart 
const addItemsToCart = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if (!userExist) {
            return next(new AppError(402, "User does not exist"));
        }
        const {productId,quantity } = req.body;
        if(!productId){
            return next(new AppError(401,"Invalid Request ! Product id is required"));
        } 
        const productExist  = await Product.findById(productId);
        if(!productExist){
            return next(new AppError(402,"This Product is Not available"));
        }
        if(quantity && (Number(quantity) < 1 || Number(quantity)>productExist.quantity)){
            return next(new AppError(402,"Quantity of the product cannot less than zero or  more then the available product quantity"));
        }
        const newProduct  = {
            product:productExist.id,
            quantity:quantity|1,
        };

        const cartItem = await Cart.create({
            user:req.user.id,
        });
        cartItem.items.push(newProduct);
        await cartItem.save();

        return res.status(200).json({
            success:true,
            message:`${productExist.name} is addred to cart ,quantityX ${quantity}`,
            cartItem
        });
        
    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

// update the cart

const updateCartItems = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user"));
        }
        const userExist = await User.findById(req.user.id);
        if (!userExist) {
            return next(new AppError(402, "User does not exist"));
        }
        const {productId,quantity } = req.body;
        if(!productId){
            return next(new AppError(401,"Invalid Request ! Product id is required"));
        } 
        const productExist  = await Product.findById(productId);
        if(!productExist){
            return next(new AppError(402,"This Product is Not available"));
        }
        if(quantity && (Number(quantity) < 1 || Number(quantity)>productExist.quantity)){
            return next(new AppError(402,"Quantity of the product cannot less than zero or  more then the available product quantity"));
        }   

        const cartItem = await Cart.findOne({user:req.user.id});

        if(!cartItem || !cartItem.items.length){
            return next(new AppError(402,"Your Cart is Empty"));
        }

        const cartItemIndex = cartItem.items.findIndex(item=>item.product.toString() === productId);

        if(cartItemIndex === -1){
            return next(new AppError(401,"This product is not available in your cart"));
        }
        cartItem.items[cartItemIndex].quantity = quantity;

       await cartItem.save();

       return res.status(200).json({
            success:true,
            message:"Cart updated successfully",
            cartItem
       });

    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

//delete the cart item
const deleteCartItem = async (req, res, next) => {
    try {

    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

export {
    getCartItems,
    addItemsToCart,
    updateCartItems,
    deleteCartItem
}

