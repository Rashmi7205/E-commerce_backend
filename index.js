import app from "./server.js";
import {config} from 'dotenv';

//Configuring environmental variables
config();

// Start the Server 
app.listen(process.env.PORT,()=>{
    console.log(`Server is Running at ${process.env.PORT}`);
});