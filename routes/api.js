var express = require('express');
var router = express.Router();
const vendorRoutes = require('./vendor');
const baseRoutes = require('./api.routes');
const userRoutes = require('./user');
const adminRoutes = require('./admin');
const employeeRoutes = require('./employee');
/*------------------------------api routing-----------------------*/
router.use('/',baseRoutes);
router.use('/user',userRoutes);
router.use('/vendor',vendorRoutes);
router.use('/admin',adminRoutes);
router.use('/employee',employeeRoutes);


module.exports = router;
