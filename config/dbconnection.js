import mongoose from 'mongoose';

const connectToDb = async ()=>{
    mongoose.set('strictQuery',true);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("db cconnected",conn.connection.host);
};

export default connectToDb;
