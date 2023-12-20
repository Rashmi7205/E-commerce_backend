import mongoose,{ Schema,model } from "mongoose";

const addressSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema({
    username:{type:String,
            required:true,
            min:[3,'Min 3 char should be name'],
            max:[20,'Max 20 char can be length of username'],
        },  
    password:{type:String,required:true,unique:true},
    profilePic:{
        type:String,
    },
    email:{
        type:String,required:true,unique:true
    },
    address:[addressSchema],
    role:{type:String,default:"User"},
    phone:{type:String,required:true},
    forgotPasswordToken:{type:String},
    resetPasswordToken:{type:String},
    
},{timestamps:true});

export default model("User",userSchema);
