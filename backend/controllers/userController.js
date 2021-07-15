const Users=require('../models/User');
const ErrorHandler=require('../utils/errorHandler');
const catchAsyncErrors=require('../middlewares/catchAsynchErrors');
const ApiFeatures = require('../utils/apiFeatures');
const sendToken=require('../utils/jwtToken');
const sendEmail=require('../utils/sendEmail');
const crypto=require('crypto');
const cloudinary=require('cloudinary');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const {name,email,password,url,public_id}=req.body;

    const user = await Users.create({
        name,
        email,
        password,
        avatar: {
            public_id: public_id,
            url: url
        }
    })

    sendToken(user, 200, res)

})
exports.loginUser=catchAsyncErrors(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return next(new ErrorHandler('Please provide a valid email or password',401));
    }
    const user =await Users.findOne({email}).select('+password');

    if(!user)
    {
        return next(new ErrorHandler('Invalid Email or password',401));
    }
    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched)
    {
        return next(new ErrorHandler('Invalid Email or password',401));
    }
    sendToken(user,201,res);
})
exports.logoutUser=catchAsyncErrors(async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httponly:true
    })

    res.status(200).json({
        success:true,
        message:'Logged out'
    });
})
//forgot password   => /api/v1/password/forgot

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user=await Users.findOne({email:req.body.email});
    if(!user)
    {
        return next(new ErrorHandler('User not found with this email',404));
    }

    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});
    //create reset pass url
    const resetUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message=`Password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email ignore it`;

    try {
        await sendEmail({
            email:user.email,
            subject:'Shopit Password recovery',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email send to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordexpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500));
    }

});

//Reset password /api/v1/password/reset/:token
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
    const token =req.params.token;
    const resetPasswordToken=crypto.createHash('sha256').update(token).digest('hex');

    const user=await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user)
    {
        return next(new ErrorHandler('Password resettoken is invalid or has expired',400));
    }
    if(req.body.password!==req.body.confirmPassword)
    {
        return next(new ErrorHandler('Password does not match',400))
    }

    user.password=req.body.password;
    
    user.resetPasswordToken=undefined;
    user.resetPasswordexpire=undefined;
    await user.save();

    sendToken(user,200,res)
});
//get user /api/v1/me
exports.getUserProfile=catchAsyncErrors(async(req,res,next)=>{
    const user=await Users.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
});

//update user profile /api/v1/me/update
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
    const newdata={
        name:req.body.name,
        email:req.body.email
    }
    if (req.body.public_id !== '') {

        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        newdata.avatar = {
            public_id: req.body.public_id,
            url: req.body.url
        }
    }
    const user=await Users.findByIdAndUpdate(req.user.id,newdata,{
        new : true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        user
    })
})

//update password /api/v1/password/update

exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await Users.findById(req.user.id).select('+password');
    const isMatched=user.comparePassword(req.body.oldPassword);

    if(!isMatched)
    {
        return next(new ErrorHandler('Old password is incorrect',400));
    }
    user.newPassword=req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})

//get all users /api/v1/admin/users
exports.getUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await Users.find();
    res.status(200).json({
        success:true,
        users
    })
})
//get single user /api/v1/admin/user/:id

exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await Users.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler(`User not found with given id:${req.params.id}`,404));
    }
    res.status(200).json({
        success:true,
        user
    })
})

//update user by admin /api/v1/admin/:id

exports.updateUser=catchAsyncErrors(async(req,res,next)=>{
    const newdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await Users.findByIdAndUpdate(req.params.id,newdata,{
        new : true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        user
    })
})

//delete user /api/v1/admin/user/:id
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await Users.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler(`User not found with given id:${req.params.id}`,404));
    }

    await user.remove();
    res.status(200).json({
        success:true,
    })
})