const express = require('express');
const router=express.Router();

const {newOrder,getSingleOrder,myOrder,allOrders,updateOrder, deleteOrder}=require('../controllers/orderController');
const {isAuthenticated,authRole}=require('../middlewares/auth')

router.route('/order/new').post(isAuthenticated,newOrder);
router.route('/orders/me').get(isAuthenticated,myOrder);
router.route('/order/:id').get(isAuthenticated,getSingleOrder);
router.route('/admin/orders').get(isAuthenticated,authRole('admin'),allOrders);
router.route('/admin/order/:id').put(isAuthenticated,authRole('admin'),updateOrder)
                                .delete(isAuthenticated,authRole('admin'),deleteOrder);

module.exports=router;