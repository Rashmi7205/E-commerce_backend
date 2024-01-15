import { User } from '../models/index.js';
import AppError from '../utils/apperror.js';
import cloudinary from 'cloudinary';
import sendEmail from '../utils/sendEmail.js';
import fs from 'fs';


const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days,
    httpOnly: true,// Cannot be accsessed by the client side javascript 
}
// register (POST)
const registerUser = async (req, res, next) => {
    try {
      // Getting the info from the req body
      const { username, email, password } = req.body;
  
      // Check if all fields are provided
      if (!username || !email || !password) {
        return next(new AppError(400, "All fields are mandatory"));
      }
  
      // Check if the user is already registered
      const isRegistered = await User.findOne({ email });
  
      if (isRegistered) {
        return next(new AppError(400, "The user already exists"));
      }
  
      // Register the user
      const user = await User.create({
        username,
        email,
        password,
      });
  
      // Do not save the user again, as it is already saved by User.create()
  
      // Making user password undefined
      user.password = undefined;
  
      // Generate token for cookie
      const token = await user.generateJWTtoken();
  
      // Set the cookie
      res.cookie('E_com_token', token, cookieOption);
  
      // Send response to the user
      return res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        user,
      });
  
    } catch (error) {
      console.error(error); // Log the error for debugging
      return next(new AppError(500, "Internal Server Error"));
    }
  };
  
// / login (POST)
const login = async (req, res, next) => {
    try {
        // getting the infor from the req.body
        const { email, password } = req.body;
       
        // Check if the email is registered or not
        const user = await User.findOne({ email });
       
        if (!user) {
            return next(new AppError(204, "No user exist register user"));
        }
        
        // checking the password is correct or not
        const isValidUser = await user.comparePassword(password);

        if (!isValidUser) {
            return next(new AppError(401, "Unauthorized, incorrect password"));
        }
       
        //generating cookies
        const token = await user.generateJWTtoken();


        //setting the cookies
        res.cookie("E_com_token", token, cookieOption);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });

    } catch (error) {
        return next(new AppError(400, error.message));
    }
};

/// logout (POST)
const logout = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user,Login for More details"));
        }

        //set the cookies to null
        res.cookie('E_com_token', null, cookieOption);

        return res.status(200).json({
            success: true,
            message: "User logged out succesfully"
        });
    } catch (error) {
        return next(new AppError(400, error.message));
    }
};

/// reset-password (POST)
const resetPassword = async (req, res, next) => {
    try {
        // get the newpassword,email from the user

        const { newPassword } = req.body;
        const { resetPasswordToken } = req.params;

        if (!newPassword) {
            return next(new AppError(402, "Set a valid password"));
        }

        const user = await User.findOne({ resetPasswordToken });

        if (!user) {
            return next(new AppError(401, "Unauthorized user"));
        }

        const updateUserPassword = await User.findByIdAndUpdate(user._id, {
            password: newPassword,
            resetPasswordToken: null,
        });

        if (!updateUserPassword) {
            return next(new AppError(401, "Internal server Error"));
        }
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        return next(new AppError(400, error.message));
    }
};

/// forgot password (POST)
const forgotPassword = async (req, res, next) => {
    try {
        //get the user email id
        const { email } = req.body;

        if (!email) {
            return next(new AppError(401, 'Email id must required'));
        }

        //find the user
        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError(402, "User doesnot exist"));
        }

        //generate a reset token 
        const resetPasswordToken = await user.generatePasswordResetToken();


        //set the token to the user schema 
        const updateUser = await User.findByIdAndUpdate(user._id, { resetPasswordToken });

        //send an email with reset token
        const subject = 'RESET YOUR PASSWORD '
        const message = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-gray-100 font-sans">
            <div class="max-w-md mx-auto bg-white p-8 rounded shadow-md mt-10">
                <h1 class="text-2xl font-bold mb-4 text-gray-800">Password Reset</h1>
                <p class="text-gray-600">Hello [User],</p>
                <p class="text-gray-600">You recently requested to reset your password. Click the button below to reset it:</p>
                <a href="${process.env.FRONTEND_URL}"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">Reset
                Password</a>
            </div>
            </body>
        </html>`;

        await sendEmail(email,subject,message);

        // send the response

        return res.status(200).json({
            success:true,
            message:`You have received an email in ${email} for password reset`,
        });

    } catch (error) {
        return next(new AppError(401, error.message));
    }
};

/// update user profile
const updateUser = async (req, res, next) => {
  try {
    const { id, email } = req.user;

    if (!req.user) {
      return next(new AppError(401, "Unauthorized user login for more details"));
    }

    const userExist = await User.findById(id);

    if (!userExist) {
      return next(new AppError(401, "User does not exist"));
    }

    // get the info from the req.body
    const { username, phone } = req.body;
    if (!username || !phone) {
      return next(new AppError(401, "All fields are mandatory"));
    }

    const user = await User.findByIdAndUpdate(id, {
      username,
      phone
    });

    if (req.file) {
      if (user?.profilePic) {
        await cloudinary.v2.uploader.destroy(user?.profilePic?.public_id);
      }

      const uploadFile = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'e_com'
      });

      await User.findByIdAndUpdate(id, {
        profilePic: {
          public_id: uploadFile.public_id,
          secure_url: uploadFile.secure_url
        },
      });

      // delete the file from the server
      if (fs.existsSync(req.file.path)) {
        // File exists, delete it
        fs.unlinkSync(req.file.path);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Account updated Successfully",
      user
    });
  } catch (error) {
    return next(new AppError(400, error.message));
  }
}
//upadte usre address
const updateUserAddress = async (req, res, next) => {
    try {
      // get user info
      if (!req.user) {
        return next(new AppError(402, "Unauthenticated User, Login for this service"));
      }
  
      // find the user exist or not
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return next(new AppError(402, "User does not exist"));
      }
  
      // get the user address
      const { street, city, state, postalCode, country, isDefault } = req.body;
  
      if (!street || !city || !state || !postalCode || !country) {
        return next(new AppError(401, "All fields are mandatory"));
      }
  
      const newAddress = {
        user: req.user.id,
        street,
        city,
        state,
        postalCode,
        country,
        isDefault
      }
  
      // update the address
      user.address.push(newAddress);
  
      await user.save();
  
      console.log(user);
      // send response
      return res.status(200).json({
        success: true,
        message: "User Address updated successfully",
        newAddress
      });
    } 
    catch (error) {
      return next(new AppError(401, error.message));
    }
};

export {
    registerUser,
    login,
    logout,
    resetPassword,
    forgotPassword,
    updateUser,
    updateUserAddress
}
