import { User } from '../models/index.js';
import AppError from '../utils/apperror.js'

const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days,
    httpOnly: true,// Cannot be accsessed by the client side javascript 
}
// register (POST)
const registerUser = async (req, res,next) => {

    try {
        // Getting the info from the req body
        const { username, email, password } = req.body;
        //check if it already registered or not
        const isRegistered = await User.findOne({email});
       
        if(isRegistered){
            return next(new AppError(400, "The user already exists"));
        }
       
        //register user
        const user = await User.create({
            username,
            email,
            password,
        });

        await  user.save();
       
        // Making user password empty
        user.password = undefined;

        //generate token for cookie 
        const token =await user.generateJWTtoken();

        // Set the cookies
        res.cookie('E_com_token',token,cookieOption);

        //send response to the user
        
        return res.status(200).json({
            succsess:true,
            message:"User Registered Succsessfully",
            user
        });

    } catch (error) {
        console.log(error.message);
        return next(new AppError(400, "The request could not be understood or was missing required parameters"));
    }

};

// / login (POST)
const login = async (req, res,next) => {
    try {
        // getting the infor from the req.body
        const {email,password} = req.body;

        // Check if the email is registered or not
        const user = await User.findOne({email});

        if(!user){
            return next(new AppError(204,"No user exist register user"));
        }

        // checking the passwor is correct or not
        const isValidUser = await user.comparePassword(password);
        if(!isValidUser){
            return next(new AppError(401,"Unauthorized, incorrect password"));
        }
       
        //generating cookies
        const token = await user.generateJWTtoken();
        

        //setting the cookies
        res.cookie("E_com_token",token,cookieOption);

        
        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user
        });

    } catch (error) {
        return next(new AppError(400,error.message));
    }
};

/// logout (POST)
const logout = async (req, res,next) => {
    try {
        if(!req.user){
            return next(new AppError(401,"Unauthenticated user,Login for More details"));
        }

        //set the cookies to null
        res.cookie('E_com_token',null,cookieOption);

        return res.status(200).json({
            success:true,
            message:"User logged out succesfully"
        });
    } catch (error) {
        return next(new AppError(400,error.message));  
    }
};

/// reset-password (POST)
const resetPassword = async (req, res) => {

};

/// forgot password (POST)
const forgotPassword = async () => {

};


export {
    registerUser,
    login,
    logout,
    resetPassword,
    forgotPassword
}
