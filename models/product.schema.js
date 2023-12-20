import mongoose ,{Schema,model } from "mongoose";


const productSchema = new Schema({
    name:{type:String,required:true},
    description:{type:String},
    price:{type:Number,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId ,ref:'User',required:true},
    catagory:{type:String,required:true},
    quantity:{type:Number,resuired:true},
    image_url:{type:String},
},{timestamps:true});

export default model("Product",productSchema);
