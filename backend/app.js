const express=require('express');
const app=express();
const errorMiddleware=require('./middlewares/error')
const dotenv=require('dotenv');


dotenv.config({path:'backend/config/config.env'});

const cookieparser=require('cookie-parser');
const bodyparser=require('body-parser');
const fileUpload=require('express-fileupload');


app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieparser());
app.use(fileUpload())



const auth=require('./routes/auth');
const products=require('./routes/products');
const order=require('./routes/order');
const payment=require('./routes/payment')


app.use('/api/v1',auth);
app.use('/api/v1',products);
app.use('/api/v1',order);
app.use('/api/v1',payment);

app.use(errorMiddleware);
module.exports=app;