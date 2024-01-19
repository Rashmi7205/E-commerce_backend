import mongoose,{ Schema,model } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const addressSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: true },
});

const userSchema = new Schema({
    username:{type:String,
            required:true,
            min:[3,'Min 3 char should be name'],
            max:[20,'Max 20 char can be length of username'],
        },  
    password:{type:String,required:true,unique:true},
    profilePic:{
        public_id:String,
        secure_url:String,
    },
    email:{
        type:String,required:true,unique:true
    },
    address:[addressSchema],
    role:{type:String,default:"User"},
    phone:{type:String},
    resetPasswordToken:{type:String},
    
},{timestamps:true});

userSchema.pre('save',async function(){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods = {
    generateJWTtoken: async function(){
        return await jwt.sign({
            id:this._id,
            email:this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        })
    },
    generatePasswordResetToken:async function(){
       const resetToken = crypto.randomBytes(10).toString('hex');

       this.forgotPasswordToken = crypto.createHash('sha256')
       .update(resetToken)
       .digest('hex')

        return resetToken;
    },
    comparePassword:async function(userPassword){
        return await bcrypt.compare(userPassword,this.password);
    }
}

export default model("User",userSchema);
