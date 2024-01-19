import mongoose ,{Schema,model } from "mongoose";


const productSchema = new Schema({
    name:{type:String,required:true},
    description:{type:String},
    price:{type:Number,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId ,ref:'User',required:true},
    category:{type:String,required:true},
    quantity:{type:Number,required:true},
    image_urls:[
        {
            public_id:String,
            secure_url:String,
        }
    ],
},{timestamps:true});
productSchema.index({name:'text',description:'text',category:'text'});

export default model("Product",productSchema);
