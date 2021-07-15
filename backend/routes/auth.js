const express = require('express');
const router=express.Router();

const {registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser}=require('../controllers/userController');
const {isAuthenticated,authRole}=require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticated,getUserProfile);
router.route('/me/update').put(isAuthenticated,updateProfile);
router.route('/password/update').put(isAuthenticated,updatePassword);
router.route('/admin/users').get(isAuthenticated,authRole('admin'),getUsers);
router.route('/admin/user/:id').get(isAuthenticated,authRole('admin'),getSingleUser)
                                .put(isAuthenticated,authRole('admin'),updateUser)
                                .delete(isAuthenticated,authRole('admin'),deleteUser);

module.exports=router;