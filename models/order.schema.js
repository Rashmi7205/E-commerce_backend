import mongoose ,{model,Schema} from 'mongoose';

const orderItemSchema = new Schema({
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',requird:true},
    quantity:{type:Number,required:true},
},{timestamps:true});

const orderSchema = new Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    items:[orderItemSchema],
    total_amount:{type:Number,required:true},
    status:{type:String,default:'Pending'},
},{timestamps:true});

const Order = model('Order',orderSchema);

export default Order;