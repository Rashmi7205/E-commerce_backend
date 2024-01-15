import { User } from "../models/index.js";
import AppError from "../utils/apperror.js";
import jwt from 'jsonwebtoken';

const isLoggedIn = async (req,res,next)=>{
   try {
        const {E_com_token} = req.cookies;
        
        if(!E_com_token){
            return next(new AppError(401,"Authentication is required and has failed, or the user does not have necessary permissions."));
        }

        const userDetails = await jwt.verify(E_com_token,process.env.JWT_SECRET);

        req.user = userDetails;
       
   } catch (error) {
        return next(new AppError(400,error.message));
   }
   finally{
        next();
   }
}

export const isAdmin = async (req,res,next)=>{
     try {
          const {E_com_token} = req.cookies;
          
          if(!E_com_token){
              return next(new AppError(401,"Authentication is required and has failed, or the user does not have necessary permissions."));
          }
  
          const userDetails = await jwt.verify(E_com_token,process.env.JWT_SECRET);
  
          req.user = userDetails;

          const user = await User.findById(req.user.id);

          if(user.role!=="Admin"){
               return next(new AppError(500,"You are not an Admin"));    
          }
         
     } catch (error) {
          return next(new AppError(400,error.message));
     }
     finally{
          next();
     }
}

export default isLoggedIn;