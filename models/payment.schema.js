import mongoose,{Schema,model} from 'mongoose';

const payementSchema = new Schema({
    payer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    payment_id:{
        type:String,
        required:true,
    },
    payment_signature:{
        type:String,
        required:true
    },
    order_id:{
        type:String ,
        required:true,
    },
});


export default model('Payment',payementSchema);