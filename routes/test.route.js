import { Router } from "express";

const testRouter = Router();

testRouter.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Hello World❤️"
    });
});

export default testRouter;