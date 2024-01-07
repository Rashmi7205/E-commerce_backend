import AppError from "../utils/apperror.js";
import {Product, Review, User} from '../models/index.js';

//post a review
const postReview = async (req,res,next)=>{
    try {
        if(!req.user){
            return next(new AppError(401,"Unauthenticated user"));
        }
        const user = await User.findById(req.user.id);

        if(!user){
            return next(new AppError(402,"This user does not exist"));
        }        
        
        const {rating,comment,productId} = req.body;
        if(!rating || !comment || !productId){
            return next(new AppError(401,"Missing parameter | All field are required  (rating,comment,productId)"));
        }

        //product exits or not
        const product = await Product.findById(productId);

        if(!product){
            return next(new AppError(402,'This product is not available'));
        }

        const review = await Review.create({
            user:user._id,
            product:productId,
            rating,
            comment
        }) ;

        if(!review){
            return next(501,"Internal server Error");
        }
        return res.status(200).json({
            success:true,
            message:"Review added successfully",
            review
        });

    } catch (error) {
        return next(new AppError(500,"Internal Server Error"));
    }
}

export {
    postReview,
    
}

