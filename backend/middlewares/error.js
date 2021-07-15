const ErrorHandler=require('../utils/errorHandler');

module.exports=(err,req,res,next)=>{
    err.statuscode=err.statuscode||500;
    if(process.env.NODE_ENV==='DEVELOPMENT')
    {
        res.status(err.statuscode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    }
    if(process.env.NODE_ENV==='PRODUCTION')
    {
        let error={ ...err };
        error.message=err.message;
        //if search product is not in db
        if(err.name ==='CastError')
        {
            const message=`Resource not found.Invalid:${err.path}`;
            error= new ErrorHandler(message,400);
        }
        //if required fields are not provided
        if(err.name==='ValidationError')
        {
            const message=Object.values(err.errors).map(value=>value.message);
            error=new ErrorHandler(message,400);
        }
        //handling mongo duplicate key error
        if(err.code===11000)
        {
            const message=`Duplicate ${Object.keys(err.keyValue)} entered`;
            error=new ErrorHandler(message,400);
        }
        //handling wrong jwt error
        if(err.name==="JsonWebTokenError")
        {
            const message='JSON web token is invalid.Try again!!!',
            error=new ErrorHandler(message,400);
        }
        //Json web token expired
        if(err.name==="TokenExpiredError")
        {
            const message='JSON web token is expired.Try again!!!',
            error=new ErrorHandler(message,400);
        }
        res.status(error.statuscode).json({
            success:false,
            message:error.message||'Internal Server Error '
        })       
    }
}