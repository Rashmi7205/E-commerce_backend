import AppError from '../utils/apperror.js';
import {Product, User} from '../models/index.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

//get products
const getProduct = async (req,res,next)=>{
    try {
        let {catagory,limit,skip} = req.params;

        if(!limit){
            limit = 20;
            skip = 0;
        }
        let productList;
        if(catagory){
            productList = await Product.find({catagory}).skip(skip).limit(limit);
        }
        else{
            productList = await Product.find({}).skip(skip).limit(limit);
        }
       
        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            productList
        });

    } catch (error) {
        return next(new AppError(402,error.message));
    }
}
/// add products 
const addProduct = async (req,res,next)=>{
    try {
     if(!req.user){
            return next(new AppError(401,"Unauthenticated user"));
        }

        const {name,description,price,catagory,quantity} = req.body;


        if(!name || !description || !price || !catagory || !quantity){
            return next(new AppError(401,"All fields are mandatory"));
        }

        const user = await User.findById(req.user.id);

        if(!user){
            return next(new AppError(402,"User does not exist"));
        }

        const newProduct = {
            name,
            owner:req.user.id,
            description,
            price : Number(price),
            catagory,
            quantity:Number(quantity)
        }
        const product =  await Product.create(newProduct);


        if(req.files.length){
            for (const image of req.files){
                    const uplaodedImage =  await cloudinary.v2.uploader.upload(image.path,{
                        folder:"e_com"
                    });
                    product.image_urls.push({
                        public_id:uplaodedImage.public_id,
                        secure_url:uplaodedImage.secure_url,
                    });
            }

            for(const image of req.files){
                if(fs.existsSync(image.path)){
                    fs.unlinkSync(image.path);
                }
            }
        }

        await product.save();

        return res.status(200).json({
            success:true,
            message:"Product added successfully!",
            product,
        });


    } catch (error) {
        return next(new AppError(402,error.message));
    }
}

// get product by id
const getProductById = async (req,res,next)=>{

}

//update product by id
const updateProductById = async (req,res,next)=>{

}

//delete product by id
const removeProductById = async (req,res,next)=>{

}

//get catagories
const getProductCatagories = async (req,res,next)=>{

}

export {
    getProduct,
    getProductById,
    updateProductById,
    removeProductById,
    getProductCatagories,
    addProduct
}




