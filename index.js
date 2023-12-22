import connectToDb from "./config/dbconnection.js";
import app from "./server.js";
import {config} from 'dotenv';
import cloudinary from 'cloudinary';

//Configuring environmental variables
config();

//configuring cloudinary 
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

// Start the Server 
app.listen(process.env.PORT,()=>{

    // Connecting To the database
    connectToDb();

    console.log(`Server is Running at ${process.env.PORT}`);
});