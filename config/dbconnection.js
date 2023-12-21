import mongoose from 'mongoose';

const connectToDb = async ()=>{
    mongoose.set('strictQuery',true);
    await mongoose.connect("mongodb://127.0.0.1:27017/e_com");
    console.log("db cconnected");
};

export default connectToDb;
