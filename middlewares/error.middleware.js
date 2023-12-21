const errorMiddleware = async(err,req,res,next)=>{
    err.statusCode  = err.statusCode || 503;
    err.message = err.message || "Bad request";

    return res.status(err.statusCode).json({
        succsess:false,
        message:err.message,
        stack:err.stack
    });
}

export default errorMiddleware;