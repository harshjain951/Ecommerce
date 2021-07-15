const ErrorHandler=require('../utils/errorHandler');
const catchAsyncErrors=require('./catchAsynchErrors');
const jwt=require('jsonwebtoken');
const Users=require('../models/User'); 

exports.isAuthenticated=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token)
    {
        return next(new ErrorHandler('Login first to access this source',401));
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await Users.findById(decoded.id);
    next();
});

exports.authRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    }
}