import mongoose ,{Schema,model } from "mongoose";

const reviewSchema  = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',requird:true},
    rating:{type:Number,required:true},
    comment:{type:String},
},{timestamps:true});

const Review = model("Review",reviewSchema);

