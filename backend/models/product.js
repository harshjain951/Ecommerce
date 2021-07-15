const mongoose=require("mongoose");

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter product name'],
        trim:true,
        maxLength:[100,'Product length cannot exceed 100 characters']
    },
    price:{
        type:Number,
        required:[true,'please enter product price'],
        maxLength:[5,'Product price cannot exceed 5 characters'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'please enter product description']
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,'Please select category for product'],
        enum:{
            values:[
                'Electronics',
                'Camera',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:"Please select correct category for product"
        }
    },
    seller:{
        type:String,
        required:[true,'Please enter product seller'],

    },
    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxLength:[5,'product cannot exceed 5 characters'],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                required:true,
                ref:'User'
            },
            name:{
                type:String,
                required:[true,'please enter name'],
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Products',productSchema);