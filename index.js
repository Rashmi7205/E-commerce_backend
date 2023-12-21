import connectToDb from "./config/dbconnection.js";
import app from "./server.js";
import {config} from 'dotenv';

//Configuring environmental variables
config();

// Start the Server 
app.listen(process.env.PORT,()=>{

    // Connecting To the database
    connectToDb();

    console.log(`Server is Running at ${process.env.PORT}`);
});