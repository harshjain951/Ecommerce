const connectDatabase=require("../config/database");
const dotenv=require('dotenv');

dotenv.config({path:'backend/config/config.env'});

const Products=require("../models/products");

const products=require("../data/product");

connectDatabase();

const seedProducts=async()=>{
    try{
        await Products.deleteMany();
        console.log("All products deleted");

        await Products.insertMany();
        console.log("All products inserted");
        products.exit();
    }catch(error){
        console.log(error);
        products.exit();
    }
}