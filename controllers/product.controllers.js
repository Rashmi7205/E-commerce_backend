import AppError from '../utils/apperror.js';
import { Product, User } from '../models/index.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

//get products
const getProduct = async (req, res, next) => {
    try {
        let { catagory, limit, skip } = req.params;

        if (!limit) {
            limit = 20;
            skip = 0;
        }

        if (limit && (limit > 50 || limit < 0)) {
            return next(new AppError(401, "Invalid limit"));
        }

        let productList;
        if (catagory) {
            productList = await Product.find({ catagory }).skip(skip).limit(limit);
        }
        else {
            productList = await Product.find({}).skip(skip).limit(limit);
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            productList
        });

    } catch (error) {
        return next(new AppError(402, error.message));
    }
}
/// add products 
const addProduct = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user"));
        }

        const { name, description, price, catagory, quantity } = req.body;


        if (!name || !description || !price || !catagory || !quantity) {
            return next(new AppError(401, "All fields are mandatory"));
        }

        if (name && (name.length > 200 || name.length < 0)) {
            return next(new AppError(401,"name must be Max less than 200 character"));
        }

        if (description && (description.length > 1000 || description.length < 0)) {
            return next(new AppError(401,"Description must be Max less than 1000 character"));
        }
        if (catagory && (catagory.length > 100 || catagory.length < 0)) {
            return next(new AppError(401,"Catagory must be Max less than 1000 character"));
        }

        if(price  && (Number(price) < 0 || Number(price) > Number.MAX_SAFE_INTEGER)){
            return next(new AppError(401,"The price is too high or less"));
        }   

        
        if(quantity  && (Number(quantity) <= 0 || Number(quantity) > Number.MAX_SAFE_INTEGER)){
            return next(new AppError(401,"The quantity is too high or less"));
        }  


        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new AppError(402, "User does not exist"));
        }

        const newProduct = {
            name,
            owner: req.user.id,
            description,
            price: Number(price),
            catagory,
            quantity: Number(quantity)
        }
        const product = await Product.create(newProduct);


        if (req.files.length) {
            for (const image of req.files) {
                const uplaodedImage = await cloudinary.v2.uploader.upload(image.path, {
                    folder: "e_com"
                });
                product.image_urls.push({
                    public_id: uplaodedImage.public_id,
                    secure_url: uplaodedImage.secure_url,
                });
            }

            for (const image of req.files) {
                if (fs.existsSync(image.path)) {
                    fs.unlinkSync(image.path);
                }
            }
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product added successfully!",
            product,
        });


    } catch (error) {
        return next(new AppError(402, error.message));
    }
}

// get product by id
const getProductById = async (req, res, next) => {
    try {
        // get the product id
        const { id } = req.params;

        if (!id) {
            return next(new AppError(402, "Product id is required"))
        }
        //check the product exist or not
        const product = await Product.findById(id);

        if (!product) {
            return next(new AppError(402, "This product doesnot exist"));
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

//update product by id
const updateProductById = async (req, res, next) => {
    try {
        //get the product id
        const { id } = req.params;
        //getting the info of product from the user
        const { name, description, price, catagory, quantity } = req.body;

        if (!name || !description || !price || !catagory || !quantity) {
            return next(new AppError(401, "Fields are empty"));
        }

        // validations
        if (name && (name.length > 200 || name.length < 0)) {
            return next(new AppError(401,"name must be Max less than 200 character"));
        }

        if (description && (description.length > 1000 || description.length < 0)) {
            return next(new AppError(401,"Description must be Max less than 1000 character"));
        }

        if (catagory && (catagory.length > 100 || catagory.length < 0)) {
            return next(new AppError(401,"Catagory must be Max less than 1000 character"));
        }


        if(price  && (Number(price) <= 0 || Number(price) > Number.MAX_SAFE_INTEGER)){
            return next(new AppError(401,"The price is too high or less"));
        }   

        
        if(quantity  && (Number(quantity) <= 0 || Number(quantity) > Number.MAX_SAFE_INTEGER)){
            return next(new AppError(401,"The quantity is too high or less"));
        }  

       // chekc the user exist or not
        
        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user"));
        }

        //if the product id is not available
        if (!id) {
            return next(new AppError(402, "Product id is required"))
        }

        const product = await Product.findById(id);

        // if the product is removed or invalid product id
        if (!product) {
            return next(new AppError(402, "This product doesnot exist"));
        }

        // if user is the owner of the product or not
        if (req.user.id !== String(product.owner)) {
            return next(new AppError(401, "Unauthenticated user,You cannot modify the product as you are not the owner"));
        }

        //update the product
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            name, description, price, catagory, quantity
        });

    
        if (!updatedProduct) {
            return next(new AppError(500, "Internal server error,Cannot upadte product details"));
        }

        //send the response
        return res.status(200).json({
            success: true,
            message: "product updated successfully",
            updatedProduct
        });
    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

//delete product by id
const removeProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return next(new AppError(401, "Unauthenticated user"));
        }

        if (!id) {
            return next(new AppError(402, "Product id is required"))
        }
        const product = await Product.findById(id);

        if (!product) {
            return next(new AppError(402, "This product doesnot exist"));
        }

        if (req.user.id !== String(product.owner)) {
            return next(new AppError(401, "Unauthenticated user"));
        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

//get catagories
const getProductCatagories = async (req, res, next) => {
    try {
        const catagories = await Product.find({}, { _id: 0, catagory: 1 });

        if (!catagories.length) {
            return next(new AppError(402, "There is no product yet"))
        }
        return res.status(200).json({
            success: true,
            message: "Available catagories fetched successfully",
            catagories
        });

    } catch (error) {
        return next(new AppError(401, error.message));
    }
}

//get users product 
const getMyProduct = async (req, res, next) => {
    try {

        let { skip, limit, catagory } = req.params;

        if (!limit) {
            limit = 20;
            skip = 0;
        }

        if (limit && (limit > 50 || limit < 0)) {
            return next(new AppError(401, "Invalid limit"));
        }

        if (!req.user) {
            return next(new AppError(401, "Unautenticted user"));
        }
        const userExist = await User.findById(req.user.id);

        if (!userExist) {
            return next(new AppError(401, "User doesnot exist"))
        }

        let productList = []
        if (catagory) {
            productList = await Product.find({ owner: req.user.id, catagory }).skip(skip).limit(limit);
        }
        else {
            productList = await Product.find({ owner: req.user.id }).skip(skip).limit(limit);
        }

        if (!productList.length) {
            return next(new AppError(402, "User doesnot have any product to sell"));
        }

        const catagories = await Product.find({ owner: req.user.id }, { _id: 0, catagory: 1 });

        return res.status(200).json({
            success: true,
            message: "user product fetched successfully",
            productList,
            catagories
        });

    } catch (error) {
        return next(new AppError(401, error.message));
    }
}


export {
    getMyProduct,
    getProduct,
    getProductById,
    updateProductById,
    removeProductById,
    getProductCatagories,
    addProduct
}




