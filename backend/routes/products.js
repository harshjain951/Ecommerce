const express = require('express');
const router=express.Router();
const {newProduct,getProducts, getSingleProduct,updateProduct, productReview, getreviews, deletereviews, getAdminProducts, deleteProduct}=require('../controllers/productController');
const app = require('../app');
const {isAuthenticated,authRole}=require('../middlewares/auth');


router.route('/products').get(getProducts);
router.route('/admin/products').get(getAdminProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/new').post(isAuthenticated,authRole('admin'),newProduct);
router.route('/admin/product/:id')
    .put(isAuthenticated, authRole('admin'), updateProduct)
    .delete(isAuthenticated, authRole('admin'), deleteProduct);
                                     
router.route('/review').put(isAuthenticated,productReview);
router.route('/reviews').get(getreviews)
                        .put(isAuthenticated,deletereviews);

module.exports=router;