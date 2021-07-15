const Products=require('../models/product');
const ErrorHandler=require('../utils/errorHandler');
const catchAsyncErrors=require('../middlewares/catchAsynchErrors');
const ApiFeatures = require('../utils/apiFeatures');
const cloudinary=require('cloudinary');

exports.newProduct=catchAsyncErrors( async (req,res,next)=>{
    req.body.user=req.user.id;
     const product =await Products.create(req.body);
     res.status(201).json({
         success:true,
         product
     });
})

exports.getProducts=catchAsyncErrors( async (req,res,next)=>{
    const resPerPage=4;
    const productCount=await Products.countDocuments();
    const apiFeatures= new ApiFeatures(Products.find(),req.query).search().filter();
    let products=await apiFeatures.query;
    let filteredProductCount=products.length;
    apiFeatures.pagination(resPerPage);
    products=await apiFeatures.query;

    setTimeout(() => {
        res.status(200).json({
            success:true,
            productsCount:productCount,
            products,
            filteredProductCount,
            resPerPage
        })
    }, 2000);
})
// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    const product = await Products.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })

})
//get all products (ADMIN) => /api/v1/admin/products
exports.getAdminProducts=catchAsyncErrors( async (req,res,next)=>{
    
    const products=await Products.find();
        res.status(200).json({
            success:true,
            products
        })
})


exports.getSingleProduct=catchAsyncErrors( async (req,res,next)=>{
        const product = await Products.findById(req.params.id);
        if(!product)
        {
            return next(new ErrorHandler('Product not found',404));
        }
        res.status(200).json({
            success:true,
            product
        })
})


exports.updateProduct=catchAsyncErrors( async (req,res,next)=>{
    
    let product = await Products.findById(req.params.id);
    
        if(!product)
        {
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }
        if(req.body.images.length!==0)
        {
            for (let i = 0; i < product.images.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }
        }
        product=await Products.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        });
        res.status(200).json({
            success:true,
            product
        });
})

//create or update review of user /api/v1/review

exports.productReview=catchAsyncErrors(async(req,res,next)=>{

    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product=await Products.findById(productId);
    const isReviewed=product.reviews.find(r=>
        (r.user.toString()===req.user._id.toString())
    )
    if(isReviewed)
    {
        product.reviews.forEach(element => {
            if(element.user.toString()===req.user._id.toString()){
                element.comment=comment;
                element.rating=rating;
            }
        });
    }
    else
    {
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }
    product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true
    });
})

//get all reviews of a product /api/v1/reviews
exports.getreviews=catchAsyncErrors(async(req,res,next)=>{
    const prod=await Products.findById(req.query.id);
    res.status(200).json({
        success:true,
        reviews:prod.reviews
    })
})

//delete review /api/v1/reviews
exports.deletereviews=catchAsyncErrors(async(req,res,next)=>{
    const prod=await Products.findById(req.query.productId);

    const reviews=prod.reviews.filter(item=>item._id.toString()!==req.query.id.toString())
    const ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length;
    const numOfReviews=reviews.length;
    
    await Products.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
    })
})