var express = require('express');
var admin = require("../controllers/Admin/AdminController");
var router = express.Router();
const { check, body, validationResult } = require('express-validator');
const config = require('../config/config');
const authenticateToken = require('../middleware/adminauthentication');
var role = require("../controllers/Admin/RoleController");
var page = require("../controllers/Admin/Page");
var country = require("../controllers/Admin/Country");
var state = require("../controllers/Admin/State");
var percentage = require("../controllers/Admin/PercentageForVender");
var city = require("../controllers/Admin/City");
var vendortermsandcondition = require("../controllers/Admin/VenderTerms");
var usertermsandcondition = require("../controllers/Admin/UserTerms");
var branch = require("../controllers/Admin/Branch");
var pageaccess = require("../controllers/Admin/PageAccess");
const db = require("../db/connection");
const baseController = require('../controllers/Admin/AdminBaseController');
const shopController = require('../controllers/Admin/AdminShopController');
var serviceType = require("../controllers/Admin/AdminServiceTypeController");
var service = require("../controllers/Admin/AdminService");
//const authenticateToken = require('../middleware/adminauthentication');
var package = require("../controllers/Admin/AdminPackageController");
var membership = require("../controllers/Admin/AdminMembershipController");
var employ = require("../controllers/Admin/AdminEmployController");
var payment = require("../controllers/Admin/AdminPaymentController");
const adminController = require('../controllers/Admin/AdminController');


var router = express.Router();
//// User Route  ////

// Login User


// Login User
router.post('/userverification',
    body('mobile').not().isEmpty().withMessage("The mobile field is required!"),
    body('password').not().isEmpty().withMessage("The password field is required!"),

    (req, res) => {
        // console.log('sdfsf');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            admin.userVerification(req, res);
        }
    });

router.use(authenticateToken);
/*------------------------------User Section Start here -----------------------*/

//Admin

router.post('/storeadmin',
    body('name').not().isEmpty().withMessage("The  Name field is required!"),
    body('password').not().isEmpty().withMessage("The password field is required!"),
    body('cpassword').not().isEmpty().withMessage("The cpassword field is required!"),
    body('roleId').not().isEmpty().withMessage("The roleId field is required!"),
    body('phoneno').not().isEmpty().withMessage("The phoneno field is required!"),
    body('branchid').not().isEmpty().withMessage("The branchid field is required!"),
    body('country').not().isEmpty().withMessage("The country field is required!"),
    body('state').not().isEmpty().withMessage("The state field is required!"),
    body('city').not().isEmpty().withMessage("The city field is required!"),
    body('pin').not().isEmpty().withMessage("The pin field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            db.query("select * from  adminlogin where phoneno='" + req.body.phoneno + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Phone Number is already exist !', {}, res);
                }
                else {
                    admin.storeadmin(req, res);
                }
            });
            //employ.storeemploy(req, res);
        }
    });





router.post('/login',
    body('phone').not().isEmpty().withMessage("The phone field is required!"),
    body('password').not().isEmpty().withMessage("The password field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            admin.viewadminforlogin(req, res);

        }
    });



//role
router.post('/storerole',
    body('rolename').not().isEmpty().withMessage("The  Role Name field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  role where Isdelete='0' and  rolename='" + req.body.rolename + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Role Name is already exist !', {}, res);
                }
                else {
                    role.storerole(req, res);
                }
            });

        }
    });

router.post('/viewrole',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {


            role.viewrole(req, res);
        }


    });

router.post('/updaterole',
    body('rolename').not().isEmpty().withMessage("The  Role Name field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The updated_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  role where Isdelete='0' and  rolename='" + req.body.rolename + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Role Name is already exist !', {}, res);
                }
                else {
                    role.updaterole(req, res);
                }
            });

        }
    });

router.post('/isdeleterole',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The updated_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            role.updateroleisdelete(req, res);
        }
    });

//page
router.post('/addpage',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  page where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Page Name is already exist !', {}, res);
                }
                else {
                    page.storepage(req, res);
                }
            });

        }
    });

router.post('/updatepage',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  page where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Page Name is already exist !', {}, res);
                }
                else {
                    page.updatepage(req, res);
                }
            });

        }
    });

router.post('/pageisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            page.updatepageisdelete(req, res);


        }
    });

router.post('/viewpage',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            page.viewpage(req, res);
        }


    });

//country

router.post('/addcountry',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  page where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Country Name is already exist !', {}, res);
                }
                else {
                    country.storecountry(req, res);
                }
            });

        }
    });

router.post('/updatecountry',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  country where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Country Name is already exist !', {}, res);
                }
                else {
                    country.updatecountry(req, res);
                }
            });

        }
    });

router.post('/countryisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            country.updatecountryisdelete(req, res);
        }



    });

router.post('/viewcountry',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            country.viewcountry(req, res);
        }


    });


//state

router.post('/addstate',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  state where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'State Name is already exist !', {}, res);
                }
                else {
                    state.storestate(req, res);
                }
            });

        }
    });

router.post('/updatestate',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  state where  Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'State Name is already exist !', {}, res);
                }
                else {
                    state.updatestate(req, res);
                }
            });

        }
    });

router.post('/stateisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            state.updatestateisdelete(req, res);

        }
    });

router.post('/viewstate',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            state.viewstate(req, res);
        }


    });

router.post('/viewstatebycountry',
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            state.viewstatebycountry(req, res);
        }


    });


//percentage

router.post('/addpercentage',
    body('venderid').not().isEmpty().withMessage("The venderid field is required!"),
    body('percentage').not().isEmpty().withMessage("The percentage field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            percentage.storepercentage(req, res);
        }



    });

router.post('/updatepercentage',
    body('venderid').not().isEmpty().withMessage("The venderid field is required!"),
    body('percentage').not().isEmpty().withMessage("The percentage field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {



            percentage.updatepercentage(req, res);



        }
    });

router.post('/percentageisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            percentage.updatepercentageisdelete(req, res);

        }
    });

router.post('/viewpercentage',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            percentage.viewpercentage(req, res);
        }


    });

router.post('/viewpercentagebyvender',
    body('registrationsid').not().isEmpty().withMessage("The registrationsid field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            percentage.viewpercentagebyvender(req, res);
        }


    });

//userterms


router.post('/addusertermsandcondition',
    body('Terms').not().isEmpty().withMessage("The Terms field is required!"),
    body('cityId').not().isEmpty().withMessage("The cityid field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  usertermsandcondition where Isdelete='0' and  cityId='" + req.body.cityId + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Already terms added to City !!', {}, res);
                }
                else {
                    usertermsandcondition.storeusertermsandcondition(req, res);
                }
            });

        }
    });

router.post('/updateusertermsandcondition',
    body('Terms').not().isEmpty().withMessage("The Terms field is required!"),
    body('cityId').not().isEmpty().withMessage("The cityid field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            usertermsandcondition.updateusertermsandcondition(req, res);
        }



    });

router.post('/usertermsandconditionisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            usertermsandcondition.updateusertermsandconditionisdelete(req, res);


        }
    });

router.post('/viewusertermsandcondition',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            usertermsandcondition.viewUsertermsbycity(req, res);
        }


    });



//venderterms


router.post('/addvendortermsandcondition',
    body('Terms').not().isEmpty().withMessage("The Terms field is required!"),
    body('cityId').not().isEmpty().withMessage("The cityid field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  vendortermsandcondition where Isdelete='0' and  cityId='" + req.body.cityId + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Already terms added to City !!', {}, res);
                }
                else {
                    vendortermsandcondition.storevendortermsandcondition(req, res);
                }
            });

        }
    });

router.post('/updatevendortermsandcondition',
    body('Terms').not().isEmpty().withMessage("The Terms field is required!"),
    body('cityId').not().isEmpty().withMessage("The cityid field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            vendortermsandcondition.updatevendortermsandcondition(req, res);
        }



    });

router.post('/vendortermsandconditionisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            vendortermsandcondition.updatevendortermsandconditionisdelete(req, res);


        }
    });

router.post('/viewvendortermsandcondition',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            vendortermsandcondition.viewtermsbycity(req, res);
        }


    });


//city


router.post('/addcity',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    body('stateid').not().isEmpty().withMessage("The State field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  city where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'City Name is already exist !', {}, res);
                }
                else {
                    city.storecity(req, res);
                }
            });

        }
    });

router.post('/updatecity',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    body('stateid').not().isEmpty().withMessage("The State field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  city where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'City Name is already exist !', {}, res);
                }
                else {
                    city.updatecity(req, res);
                }
            });

        }
    });

router.post('/cityisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {


            city.updatecityisdelete(req, res);


        }
    });

router.post('/viewcity',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            city.viewcity(req, res);
        }


    });

router.post('/viewcitybystate',
    body('stateid').not().isEmpty().withMessage("The State field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            city.viewcitybyState(req, res);
        }


    });

//branch




router.post('/addbranch',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    body('stateid').not().isEmpty().withMessage("The State field is required!"),
    body('cityid').not().isEmpty().withMessage("The City field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  branch where Isdelete='0' and name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Branch Name is already exist !', {}, res);
                }
                else {
                    branch.storebranch(req, res);
                }
            });

        }
    });

router.post('/updatebranch',
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('countryid').not().isEmpty().withMessage("The Country field is required!"),
    body('stateid').not().isEmpty().withMessage("The State field is required!"),
    body('cityid').not().isEmpty().withMessage("The City field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  branch where Isdelete='0' and  name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Branch Name is already exist !', {}, res);
                }
                else {
                    branch.updatebranch(req, res);
                }
            });

        }
    });

router.post('/branchisdelete',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            branch.updatebranchisdelete(req, res);


        }
    });

router.post('/viewbranch',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            branch.viewbranch(req, res);
        }


    });

router.post('/viewbranchbycity',
    body('cityid').not().isEmpty().withMessage("The City field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            branch.viewbranchbyCity(req, res);
        }


    });


//add page access
router.post('/addpageaccess',
    body('pageid').not().isEmpty().withMessage("The pageid is required!"),
    body('C').not().isEmpty().withMessage("The C field is required!"),
    body('R').not().isEmpty().withMessage("The C field is required!"),
    body('U').not().isEmpty().withMessage("The C field is required!"),
    body('D').not().isEmpty().withMessage("The C field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    body('roleId').not().isEmpty().withMessage("The roleId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            db.query("select * from  pageaccess where  pageid='" + req.body.pageid + "' and roleId= '" + req.body.pageid + "' and  Isdelete='0'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Page already added !', {}, res);
                }
                else {
                    db.query("select * from  page where  id='" + req.body.pageid + "'  and  Isdelete='0'", (err, result, fields) => {
                        if (err) throw err;
                        if (result.length > 0) {
                            pageaccess.storepageaccess(req, res);

                        }
                        else {
                            config.response(500, 'Page does not  exist !', {}, res);
                        }


                    });

                }
            });
        }
    });

//add page access
router.post('/updatepageaccess',
    body('id').not().isEmpty().withMessage("The id is required!"),
    body('pageid').not().isEmpty().withMessage("The pageid is required!"),
    body('C').not().isEmpty().withMessage("The C field is required!"),
    body('R').not().isEmpty().withMessage("The C field is required!"),
    body('U').not().isEmpty().withMessage("The C field is required!"),
    body('D').not().isEmpty().withMessage("The C field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('roleId').not().isEmpty().withMessage("The roleId field is required!"),
    body('updated_at').not().isEmpty().withMessage("The updated_at field is required!"),


    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            pageaccess.updatepageaccess(req, res);
        }
    });

router.post('/updatepageaccessisdelete',
    body('id').not().isEmpty().withMessage("The id is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),


    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            pageaccess.updatepageaccessloginisdelete(req, res);
        }
    });


router.post('/viewpageaccess',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            pageaccess.viewaccess(req, res);
        }


    });

router.post('/viewpageaccessbypage',
    body('pageid').not().isEmpty().withMessage("The pageid is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            pageaccess.viewaccessByPage(req, res);
        }

    });


router.post('/viewpageaccessbypageroleId',
    body('pageid').not().isEmpty().withMessage("The pageid is required!"),
    body('roleId').not().isEmpty().withMessage("The pageid is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            pageaccess.viewaccessByPageByRole(req, res);
        }

    });

//shops

router.post('/addshop',
    body('vendorId').not().isEmpty().withMessage("The vendor Id is required!"),
    body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
    body('branchName').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('shopName').not().isEmpty().withMessage("The Shop Name field is required!"),
    body('shopName').isLength({ max: 25 }).withMessage("Max length is 25!"),
    body('panNo').not().isEmpty().withMessage("The pan number field is required!"),
    body('panNo').not().isEmpty().matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !'),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mobile').not().isEmpty().matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !'),
    body('description').not().isEmpty().withMessage("The description field is required!"),
    body('description').isLength({ max: 200 }).withMessage("Max length is 200!"),
    body('gstNo').not().isEmpty().withMessage("The GST No field is required!"),
    body('gstNo').isLength({ max: 20 }).withMessage("Invalid Gst No !"),
    body('address').not().isEmpty().withMessage("The address field is required!"),
    body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!"),
    body('aadhaar').not().isEmpty().matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid aadhaar No !'),
    body('country').not().isEmpty().withMessage("The country field is required!"),
    body('state').not().isEmpty().withMessage("The state field is required!"),
    body('city').not().isEmpty().withMessage("The city field is required!"),
    body('pin').not().isEmpty().withMessage("The pin field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            shopController.storeshop(req, res); (req, res);
        }

    });

router.post('/isdeleteshop',
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            shopController.updateshopisdelete(req, res);
        }
    });

router.post('/updateshop',
    body('vendorId').not().isEmpty().withMessage("The vendor Id is required!"),
    body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
    body('branchName').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('shopName').not().isEmpty().withMessage("The Shop Name field is required!"),
    body('shopName').isLength({ max: 25 }).withMessage("Max length is 25!"),
    body('panNo').not().isEmpty().withMessage("The pan number field is required!"),
    body('panNo').not().isEmpty().matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !'),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mobile').not().isEmpty().matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !'),
    body('description').not().isEmpty().withMessage("The description field is required!"),
    body('description').isLength({ max: 200 }).withMessage("Max length is 200!"),
    body('gstNo').not().isEmpty().withMessage("The GST No field is required!"),
    body('gstNo').isLength({ max: 20 }).withMessage("Invalid Gst No !"),
    body('address').not().isEmpty().withMessage("The address field is required!"),
    body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!"),
    body('aadhaar').not().isEmpty().matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid aadhaar No !'),
    body('country').not().isEmpty().withMessage("The country field is required!"),
    body('state').not().isEmpty().withMessage("The state field is required!"),
    body('city').not().isEmpty().withMessage("The city field is required!"),
    body('pin').not().isEmpty().withMessage("The pin field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            shopController.shopUpdate(req, res); (req, res);
        }
    });

router.post('/viewshop',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        shopController.viewshop(req, res);
    });

router.post('/approvedeclaineshop',

    body('status').not().isEmpty().withMessage("The status is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.approvedeclainshop(req, res);
        }
    });



router.post('/addShops',

    body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
    body('branchName').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('shopName').not().isEmpty().withMessage("The Shop Name field is required!"),
    body('shopName').isLength({ max: 25 }).withMessage("Max length is 25!"),
    body('panNo').not().isEmpty().withMessage("The pan number field is required!"),
    body('panNo').not().isEmpty().matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !'),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mobile').not().isEmpty().matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !'),
    body('description').not().isEmpty().withMessage("The description field is required!"),
    body('description').isLength({ max: 200 }).withMessage("Max length is 200!"),
    body('gstNo').not().isEmpty().withMessage("The GST No field is required!"),
    body('gstNo').isLength({ max: 20 }).withMessage("Invalid Gst No !"),
    body('address').not().isEmpty().withMessage("The address field is required!"),
    body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!"),
    body('aadhaar').not().isEmpty().matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid mobile No !'),
    body('country').not().isEmpty().withMessage("The country field is required!"),
    body('state').not().isEmpty().withMessage("The state field is required!"),
    body('city').not().isEmpty().withMessage("The city field is required!"),

    body('pin').not().isEmpty().withMessage("The pin field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {

            shopController.register(req, res); (req, res);



        }

    });

router.post('/ListViewForShops',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        shopController.ListViewregistrionsForVendor(req, res);
    });

router.post('/listofunapprovedshops',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.ListOfUnApprovedVendor(req, res);
        }

    });

router.post('/viewonboaredshopcount',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewonboardedvendercount(req, res);
        }

    });

router.post('/viewapprovedshopcount',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewapprovedvendercount(req, res);
        }

    });


router.post('/viewblockedshopcount',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewblockedvendercount(req, res);
        }

    });

router.post('/viewdeclinedshopcount',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewdeclinedvendercount(req, res);
        }

    });


router.post('/viewonboaredshopcountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewonboardedvendercountbybranch(req, res);
        }

    });


router.post('/viewapprovedshopcountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewapprovedvendercountbybranch(req, res);
        }

    });

router.post('/viewblockedshopcountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewblockedvendercountbybranch(req, res);
        }

    });


router.post('/viewdeclinedshopscountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewdeclinedvendercountbybranch(req, res);
        }

    });



router.post('/viewonboaredshopcountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewonboardedvendercountbybranch(req, res);
        }

    });

router.post('/viewapprovedshopscountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewapprovedvendercountbybranch(req, res);
        }

    });

router.post('/viewblockedshopscountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewblockedvendercountbybranch(req, res);
        }

    });


router.post('/viewdeclinedshopscountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewdeclinedvendercountbybranch(req, res);
        }

    });

router.post('/listapprovedshop',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.ListOfApprovedVendor(req, res);
        }

    });

router.post('/listblockedshop',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.ListOfBlockedVendor(req, res);
        }

    });

router.post('/registrationUpdateStatusshop',
    body('status').not().isEmpty().withMessage("The status field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('updated_by').not().isEmpty().withMessage("The IsDelete field is required!"),
    body('comment').not().isEmpty().withMessage("The Comment field is required!"),
    body('percentage').not().isEmpty().withMessage("The Comment field is required!"),


    (req, res) => {
        shopController.registrationUpdateStatus(req, res);
    });

router.post('/ListViewForshop',

    (req, res) => {
        shopController.ListViewregistrionsForVendor(req, res);
    });

router.post('/registrationIsDeleteShop',
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('updated_by').not().isEmpty().withMessage("The IsDelete field is required!"),
    (req, res) => {
        shopController.registrationIsDelete(req, res);
    });



router.post('/listofunapprovedshops',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.ListOfUnApprovedShops(req, res);
        }

    });


router.post('/listapprovedshops',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.ListOfApprovedShops(req, res);
        }

    });

router.post('/listblockedshops',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            sh.ListOfBlockedVendor(req, res);
        }

    });

//service Type
router.post('/viewservicetype',
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            serviceType.viewServiceType(req, res);
        }
    });


//service
router.post('/viewservice',
    body('serviceTypeIds').not().isEmpty().withMessage("The serviceTypeIds field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            service.viewService(req, res);
        }

    });


router.post('/listofunapprovedvendor',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.ListOfUnApprovedVendor(req, res);
        }

    });




router.post('/listapprovedvendor',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.ListOfApprovedVendor(req, res);
        }

    });

router.post('/listblockedvendor',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.ListOfBlockedShops(req, res);
        }

    });

router.post('/registrationUpdateStatus',
    body('status').not().isEmpty().withMessage("The status field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('updated_by').not().isEmpty().withMessage("The IsDelete field is required!"),
    body('comment').not().isEmpty().withMessage("The Comment field is required!"),
    body('percentage').not().isEmpty().withMessage("The Comment field is required!"),


    (req, res) => {
        baseController.registrationUpdateStatus(req, res);
    });

router.post('/ListViewForVendor',

    (req, res) => {
        baseController.ListViewregistrionsForVendor(req, res);
    });
// Update User 

router.post('/registrationadd',

    body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
    body('branchName').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('shopName').not().isEmpty().withMessage("The Vendor Name field is required!"),
    body('shopName').isLength({ max: 25 }).withMessage("Max length is 25!"),
    body('panNo').not().isEmpty().withMessage("The pan number field is required!"),
    body('panNo').not().isEmpty().matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !'),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mobile').not().isEmpty().matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !'),
    body('description').not().isEmpty().withMessage("The description field is required!"),
    body('description').isLength({ max: 200 }).withMessage("Max length is 200!"),
    body('gstNo').not().isEmpty().withMessage("The GST No field is required!"),
    body('gstNo').isLength({ max: 20 }).withMessage("Invalid Gst No !"),
    body('address').not().isEmpty().withMessage("The address field is required!"),
    body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!"),
    body('aadhaar').not().isEmpty().matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid mobile No !'),
    body('country').not().isEmpty().withMessage("The country field is required!"),
    body('state').not().isEmpty().withMessage("The state field is required!"),
    body('city').not().isEmpty().withMessage("The city field is required!"),

    body('pin').not().isEmpty().withMessage("The pin field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            db.query("select * from vendors where mobile='" + req.body.mobile + "' and gstNo='" + req.body.gstNo + "' where IsDelete='0'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Vender Name already Saved !', {}, res);
                }
                else {
                    baseController.register(req, res); (req, res);
                }
            })

        }

    });


router.post('/registrationupdate',
    body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
    body('branchName').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('shopName').not().isEmpty().withMessage("The Shop Name field is required!"),
    body('shopName').isLength({ max: 25 }).withMessage("Max length is 25!"),
    body('panNo').not().isEmpty().withMessage("The pan number field is required!"),
    body('panNo').not().isEmpty().matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !'),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mobile').not().isEmpty().matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !'),
    body('description').not().isEmpty().withMessage("The description field is required!"),
    body('description').isLength({ max: 200 }).withMessage("Max length is 200!"),
    body('gstNo').not().isEmpty().withMessage("The GST No field is required!"),
    body('gstNo').isLength({ max: 20 }).withMessage("Invalid Gst No !"),
    body('address').not().isEmpty().withMessage("The address field is required!"),
    body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!"),
    body('aadhaar').not().isEmpty().matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid aadhaar No !'),
    body('country').not().isEmpty().withMessage("The country field is required!"),
    body('state').not().isEmpty().withMessage("The state field is required!"),
    body('city').not().isEmpty().withMessage("The city field is required!"),

    body('pin').not().isEmpty().withMessage("The pin field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            // db.query("select * from vendors where mobile='" + req.body.mobile + "' or shopName='" + req.body.shopName + "'", (err, result, fields) => {
            //     if (err) throw err;
            //     if (result.length > 0) {
            //         config.response(500, 'Service already Saved !', {}, res);
            //     }
            //     else {
            baseController.registrationUpdate(req, res); (req, res);
            //     }
            // })

        }

    });

router.post('/registrationIsDelete',
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('updated_by').not().isEmpty().withMessage("The IsDelete field is required!"),
    (req, res) => {
        baseController.registrationIsDelete(req, res);
    });

// router.post('/registrationvendorblock',
// body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
// body('shopName').not().isEmpty().withMessage("The Shop Name field is required!"),
// body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),

// (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         config.response(400, 'Validation Error!', { errors: errors.array() }, res);
//     }
//     else {
//         db.query("select * from vendors where mobile='" + req.body.mobile + "' and shopName='" + req.body.shopName + "'", (err, result, fields) => {
//             if (err) throw err;
//             if (result.length > 0) {
//                 baseController.registrationVendorBlock(req, res); (req, res);
//             }
//             else {

//                 config.response(500, 'Vendor is not present, Please check input given !!!', {}, res);
//             }
//         })

//     }

// });

// router.post('/registrationvendorapprove',
// body('branchName').not().isEmpty().withMessage("The Branch Name field is required!"),
// body('shopName').not().isEmpty().withMessage("The Shop Name field is required!"),
// body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),

// (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         config.response(400, 'Validation Error!', { errors: errors.array() }, res);
//     }
//     else {
//         db.query("select * from vendors where mobile='" + req.body.mobile + "' and shopName='" + req.body.shopName + "'", (err, result, fields) => {
//             if (err) throw err;
//             if (result.length > 0) {
//                 baseController.registrationVendorApprove(req, res); (req, res);
//             }
//             else {

//                 config.response(500, 'Vendor is not present, Please check input given !!!', {}, res);
//             }
//         })

//     }

// });

router.get('/adminlist', async (req, res) => {
    await admin.getAdmins(req, res);
});

// router.put('/admin/:id', async (req, res) => {
//   await admin.updateAdmin(req, res);
// });

router.post('/adminupdating', async (req, res) => {
    await admin.updateAdmin(req, res);
});


router.post('/updateadmin', async (req, res) => {
    await admin.updateadmins(req, res);
});
router.delete('/admin/:id', async (req, res) => {
    await admin.deleteAdmin(req, res);
});



// service

/*------------------------------api Service-----------------------*/



router.post('/viewservicebyvender',
    body('mode').not().isEmpty().withMessage("The mode field is required!"),
    body('registerId').not().isEmpty().withMessage("The registerId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            service.viewServiceByvender(req, res);
        }

    });

//View Service with filter reggistrationId
router.post('/viewonlyservice',
    body('shopId').not().isEmpty().withMessage("The registerId field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            service.viewOnlyService(req, res);
        }

    });

// Insert Empoly 
router.post('/storeservice',
    body('name').not().isEmpty().withMessage("The Service Name field is required!"),
    body('name').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('shopId').not().isEmpty().withMessage("The shop Name field is required!"),
    body('vendorId').not().isEmpty().withMessage("The mode field is required!"),
    body('servicetypeId').not().isEmpty().withMessage("The servicetypeId field is required!"),
    body('createdby').not().isEmpty().withMessage("The createdby field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            db.query("select * from  service where name='" + req.body.name + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'Service Name is already exist !', {}, res);
                }
                else {
                    service.storeService(req, res);
                }
            });
            //employ.storeemploy(req, res);
        }
    });

// update service 
router.post('/updatservice',
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('name').not().isEmpty().withMessage("The Service Name field is required!"),
    body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
    body('vendorId').not().isEmpty().withMessage("The vendorId field is required!"),
    body('servicetypeId').not().isEmpty().withMessage("The servicetypeId field is required!"),
    body('userId').not().isEmpty().withMessage("The userId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.Updatservice(req, res);
        }
    });

// IsDelete service
router.post('/isdeleteservice',

    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('userId').not().isEmpty().withMessage("The userId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.IsDeleteservice(req, res);
        }
    });

// Delete service
router.post('/deleteservice', (req, res) => {
    service.deleteService(req, res);
});

// Insert Empolyee 
router.post('/storeservicetype',
    check(
        'price',
        'price must be a number'
    ).isFloat({ min: 0 }),
    check(
        'timeTaken',
        'Time Taken must be a number'
    ).isFloat({ min: 0 }),
    body('serviceId').not().isEmpty().withMessage("The Service Name field is required!"),
    body('type').not().isEmpty().withMessage("The Service Type Name field is required!"),
    body('price').not().isEmpty().withMessage("The price field is required!"),
    body('timeTaken').not().isEmpty().withMessage("The Time Taken field is required!"),
    body('details').not().isEmpty().withMessage("The details field is required!"),
    body('persontype').not().isEmpty().withMessage("The persontype field is required!"),
    body('userId').not().isEmpty().withMessage("The persontype field is required!"),

    //body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.storeServiceType(req, res);
        }
    });

// update Empolyee 
router.post('/updatservicetype',
    check(
        'price',
        'price must be a number'
    ).isFloat({ min: 0 }),
    check(
        'timeTaken',
        'Time Taken must be a number'
    ).isFloat({ min: 0 }),
    body('serviceName').not().isEmpty().withMessage("The Service Name field is required!"),
    body('type').not().isEmpty().withMessage("The Service Type Name field is required!"),
    body('price').not().isEmpty().withMessage("The price field is required!"),
    body('timeTaken').not().isEmpty().withMessage("The Time Taken field is required!"),
    body('details').not().isEmpty().withMessage("The details field is required!"),
    body('persontype').not().isEmpty().withMessage("The persontype field is required!"),
    //body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.Updatservicetype(req, res);
        }
    });
router.post('/updatservicetypestatus',

    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('status').not().isEmpty().withMessage("The Service Type Name field is required!"),
    body('comment').not().isEmpty().withMessage("The comment field is required!"),
    //body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.Updatservicetypestatus(req, res);
        }
    });

// get serviceId 
router.post('/viewservicetypebyId',
    body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.viewserviceTypeWithID(req, res);
        }
    });

// isdelete service type 
router.post('/isdeleteservicetype',

    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            service.IsDeleteservicetype(req, res);
        }
    });


router.post('/viewserviceandservietype', (req, res) => {
    service.viewServiceandServiceType(req, res);
});


// Delete service type
router.post('/deleteServicetype', (req, res) => {
    service.deleteServiceType(req, res);
});

// Fatch  service type
router.post('/viewservicetype', (req, res) => {
    service.viewserviceType(req, res);
});

//View Service with filter registrationId
router.post('/viewonlyservicetype',
    body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            service.viewonlyserviceType(req, res);
        }

    });


// Fatch  service type
router.post('/servicenamelist', (req, res) => {
    service.serviceNameList(req, res);
});

//PACKAGE


/*------------------------------Package api-----------------------*/
// Insert Package 
router.post('/storepackage',
    body('userId').not().isEmpty().withMessage("The userId field is required!"),
    body('packageName').not().isEmpty().withMessage("The package Name field is required!"),
    body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
    body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
    body('price').not().isEmpty().withMessage("The password field is required!"),
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by is required!"),
    body('terms').not().isEmpty().withMessage("The terms is required!"),
    body('shopId').not().isEmpty().withMessage("The shopId is required!"),
    body('serviceId').not().isEmpty().withMessage("The serviceId is required!"),
    body('details').not().isEmpty().withMessage("The details is required!"),
    body('discount').not().isEmpty().withMessage("The discount is required!"),
    body('file').not().isEmpty().withMessage("The file is required!"),
    check('price', 'price must be a number').isFloat({ min: 0 }),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            if (req.body.startDate > req.body.endDate) {
                config.response(400, 'start date should be smaller!', {}, res);
            }
            else {
                db.query("select * from packages where packageName='" + req.body.packageName + "' AND startDate<='" + req.body.startDate + "' AND endDate>='" + req.body.endDate + "' ", (err, result, fields) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        config.response(500, 'Package already Confirm !', {}, res);
                    }
                    else {
                        package.storePackage(req, res);
                    }
                });

            }
        }
    });


// Update Empoly 
router.post('/updatepackage',
    body('packageName').not().isEmpty().withMessage("The package Name field is required!"),
    body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
    body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
    body('price').not().isEmpty().withMessage("The price field is required!"),
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    check('price', 'price must be a number').isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            if (req.body.startDate > req.body.endDate) {
                config.response(400, 'start date should be smaller!', {}, res);
            }
            else {
                db.query("select * from packages where packageName='" + req.body.packageName + "' AND startDate<='" + req.body.startDate + "' AND endDate>='" + req.body.endDate + "' ", (err, result, fields) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        config.response(500, 'Package already Confirm !', {}, res);
                    }
                    else {
                        package.updatePackage(req, res);
                    }
                });

            }
        }
    });

// Delete Employ
router.post('/deletepackage', (req, res) => {
    package.deletePackage(req, res);
});

// Fatch slots Name
// router.post('/packagelist',(req, res) =>{
//     package.viewPackage(req, res);
// });


// fetch package 
router.post('/packagelist',
    // body('userId').not().isEmpty().withMessage("The userId field is required!"),
    // body('mode').not().isEmpty().withMessage("The mode is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            package.viewAllPackage(req, res);

        }
    });



router.post('/packagelistbyservice',
    body('packageid').not().isEmpty().withMessage("The packageid field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            package.viewPackageNameByService(req, res);

        }
    });

// Shop by VendorID
router.post('/shopbyvendor',
    body('vendorid').not().isEmpty().withMessage("The vendorid field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            shopController.viewShopByVendor(req, res);

        }
    });

//Service by Shop 
router.post('/servicebyshop',
    body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            service.viewServiceByshop(req, res);

        }
    });


//Subservice by Service
router.post('/subservicebyservice',
    body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            service.viewSubServiceByservice(req, res);

        }
    });


/*------------------------------Package Details api-----------------------*/
// Insert Package Details 
router.post('/storepackagedetails',
    body('packageId').not().isEmpty().withMessage("The packageId field is required!"),
    body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
    body('offer').not().isEmpty().withMessage("The offer field is required!"),
    check(
        'offer',
        'offer must be a number'
    ).isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            package.storePackageDetails(req, res);
        }
    });


// Update Package Details  
router.post('/updatepackagedetails',
    body('packageId').not().isEmpty().withMessage("The packageId field is required!"),
    body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
    body('offer').not().isEmpty().withMessage("The offer field is required!"),
    check(
        'offer',
        'offer must be a number'
    ).isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            package.updatePackageDetails(req, res);
        }
    });

// Update Package Details  
router.post('/updatepackagedetailsStatus',
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('comment').not().isEmpty().withMessage("The serviceTypeId field is required!"),
    body('status').not().isEmpty().withMessage("The offer field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            package.updatePackageDetailsStatus(req, res);
        }
    });



//Is Delete PackageDetails

router.post('/isdeletepackagedetails',
    body('id').not().isEmpty().withMessage("The Id field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            package.IsDeletePackageDetails(req, res);
        }
    });

// Delete Package Details 
router.post('/deletepackagedetails', (req, res) => {
    package.deletePackageDetails(req, res);
});

// Fatch Package Details 
// router.post('/packagelistdetails',(req, res) =>{
//     package.viewPackageDetails(req, res);
// });


router.post('/packagelistdetails',
    body('packageId').not().isEmpty().withMessage("The packageId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            package.viewPackageDetails(req, res);
        }
    });

router.post('/packagelistfordropdown',
    body('userId').not().isEmpty().withMessage("The userId field is required!"),
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            package.viewPackageForDropDown(req, res);

        }
    });


/*------------------------------membership api-----------------------*/
// Insert Membership Details  
router.post('/storemembership',
    body('membershipName').not().isEmpty().withMessage("The membership Name field is required!"),
    body('packageId').not().isEmpty().withMessage("The package Name field is required!"),
    body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
    body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
    body('price').not().isEmpty().withMessage("The password field is required!"),
    body('serviceTypeId').not().isEmpty().withMessage("The Service Type is required!"),
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    check('price', 'price must be a number').isFloat({ min: 0 }),

    check(
        'offer',
        'Offer must be a number'
    ).isFloat({ min: 0 }),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            if (req.body.startDate > req.body.endDate) {
                config.response(400, 'start date should be smaller!', {}, res);
            }
            else {
                db.query("select * from memberships where membershipName='" + req.body.membershipName + "' AND startDate<='" + req.body.startDate + "' AND endDate>='" + req.body.endDate + "' ", (err, result, fields) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        config.response(500, 'Membershipalready Confirm !', {}, res);
                    }
                    else {
                        membership.storeMembership(req, res);
                    }
                });

            }
        }
    });


// Update Empoly 
router.post('/updatemembership',
    body('membershipName').not().isEmpty().withMessage("The membership Name field is required!"),
    body('packageId').not().isEmpty().withMessage("The package Name field is required!"),
    body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
    body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
    body('price').not().isEmpty().withMessage("The password field is required!"),
    body('serviceTypeId').not().isEmpty().withMessage("The Service Type is required!"),
    body('actualPrice').not().isEmpty().withMessage("The Actual Price is required!"),
    body('timeTaken').not().isEmpty().withMessage("The Time Taken is required!"),
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    check('price', 'price must be a number').isFloat({ min: 0 }),
    check('actualPrice', 'Actual Price must be a number').isFloat({ min: 0 }),
    check(
        'offerPrice',
        'Actual Price must be a number'
    ).isFloat({ min: 0 }),

    check(
        'timeTaken',
        'actualPrice must be a number'
    ).isFloat({ min: 0 }),
    check(
        'offer',
        'Offer must be a number'
    ).isFloat({ min: 0 }),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            if (req.body.startDate > req.body.endDate) {
                config.response(400, 'start date should be smaller!', {}, res);
            }
            else {
                db.query("select * from memberships where membershipName='" + req.body.membershipName + "' AND startDate<='" + req.body.startDate + "' AND endDate>='" + req.body.endDate + "' ", (err, result, fields) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        config.response(500, 'Membership already Confirm !', {}, res);
                    }
                    else {
                        membership.updateMembership(req, res);
                    }
                });

            }
        }
    });

// IsDelete Empoly 
router.post('/isdeleteMembership',
    body('id').not().isEmpty().withMessage("The id is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.isDeleteMembership(req, res);
        }
    });

// Delete Employ
router.post('/deleteMembership', (req, res) => {
    membership.deleteMembership(req, res);
});

// Fatch slots Name
// router.post('/membershiplist',(req, res) =>{
//     membership.viewMembership(req, res);
// });


router.post('/membershiplistservice',
    body('membershipId').not().isEmpty().withMessage("The membershipId field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            membership.viewMembershipService(req, res);

        }
    });


router.post('/membershiplist',
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    body('userId').not().isEmpty().withMessage("The userId is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.viewMembership(req, res);
        }
    });

router.post('/membershiplistdropdown',
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    body('userId').not().isEmpty().withMessage("The userId is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.viewMembershipdropdown(req, res);
        }
    });



/*------------------------------membership Details api-----------------------*/
// Insert Membership Details 
router.post('/storemembershipdetails',
    body('membershipId').not().isEmpty().withMessage("The membershipId field is required!"),
    body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
    body('offer').not().isEmpty().withMessage("The offer field is required!"),
    body('noOfTime').not().isEmpty().withMessage("The No Of Time field is required!"),
    check(
        'offer',
        'offer must be a number'
    ).isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.storeMembershipDetails(req, res);
        }
    });


// Update Membership Details  
router.post('/updatemembershipdetails',
    body('membershipId').not().isEmpty().withMessage("The membershipId field is required!"),
    body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
    body('offer').not().isEmpty().withMessage("The offer field is required!"),
    body('noOfTime').not().isEmpty().withMessage("The No Of Time field is required!"),
    check(
        'offer',
        'offer must be a number'
    ).isFloat({ min: 0 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.updateMembershipDetails(req, res);
        }
    });

router.post('/updatemembershipdetailsstatus',
    body('id').not().isEmpty().withMessage("The id field is required!"),
    body('status').not().isEmpty().withMessage("The serviceTypeId field is required!"),
    body('comment').not().isEmpty().withMessage("The offer field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.updateMembershipDetailsStatus(req, res);
        }
    });

// Delete Membership Details 
router.post('/deletemembershipdetails', (req, res) => {
    membership.deleteMembershipDetails(req, res);
});

// Fatch Membership Details 
// router.post('/membershipdetailslistdetails',(req, res) =>{
//     membership.viewMembershipDetails(req, res);
// });


//
router.post('/membershipdetails',
    body('membershipId').not().isEmpty().withMessage("The membershipId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            membership.viewMembershipDetails(req, res);
        }
    });

//add employee

//View Empoly
router.post('/viewempolyee',
    body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
    body('mode').not().isEmpty().withMessage("The mode field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            employ.viewempoly(req, res);
        }

    });

//View Empolydropdown
router.post('/viewempolyeedropdown',
    body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
    body('mode').not().isEmpty().withMessage("The mode field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            employ.viewempolydropdown(req, res);
        }

    });

// Insert Empoly 
router.post('/addemployee',
    body('employName').not().isEmpty().withMessage("The employ Name field is required!"),
    body('userId').isLength({ max: 50 }).withMessage("The user Idfield is required!"),
    body('shopId').not().isEmpty().withMessage("The shop Id field is required!"),
    body('registerId').not().isEmpty().withMessage("The register Id field is required!"),
    body('password').not().isEmpty().withMessage("The password field is required!"),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mode').not().isEmpty().withMessage("The mode field is required!"),
    body('file').not().isEmpty().withMessage("The file field is required!"),
    body('gender').not().isEmpty().withMessage("The gender field is required!"),


    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            config.validateMobile(req.body.mobile, res);
            db.query("select * from  employee where mobile='" + req.body.mobile + "'", (err, result, fields) => {
                if (err) throw err;
                if (result.length > 0) {
                    config.response(500, 'employee is already exist !', {}, res);
                }
                else {
                    employ.storeemploy(req, res);
                }
            });
            //employ.storeemploy(req, res);
        }
    });


///update employ 


router.post('/updateemployee',
    body('employName').not().isEmpty().withMessage("The employ Name field is required!"),
    body('employName').isLength({ max: 50 }).withMessage("Max length is 50!"),
    body('userId').not().isEmpty().withMessage("The user Id field is required!"),
    body('shopId').not().isEmpty().withMessage("The shop Id field is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated by field is required!"),
    body('password').not().isEmpty().withMessage("The password field is required!"),
    body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
    body('mode').not().isEmpty().withMessage("The mode field is required!"),
    body('file').not().isEmpty().withMessage("The file field is required!"),
    body('gender').not().isEmpty().withMessage("The gender field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            config.validateMobile(req.body.mobile, res);
            employ.updateemployee(req, res);
        }
    });

// Delete Employ
router.post('/deleteemployee', (req, res) => {
    employ.deleteemployee(req, res);
});

// Delete Employ

router.post('/isdeleteemployee',

    body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            employ.updateemployeeisdelete(req, res);
        }
    });

// Approve/Declain Employee

router.post('/approvedeclaineemployee',

    body('adminstatus').not().isEmpty().withMessage("The admin status is required!"),
    body('updated_by').not().isEmpty().withMessage("The updated by field is required!"),
    body('id').not().isEmpty().withMessage("The id field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            employ.approvedeclainemployee(req, res);
        }
    });

//payment
router.post('/addpayment',
    body('venderId').not().isEmpty().withMessage("The venderId field is required!"),
    body('amountcollected').isLength({ max: 50 }).withMessage("amountcollected field is required!"),
    body('bookingdetaislId').not().isEmpty().withMessage("The bookingdetaislId field is required!"),
    body('paymentcharges').not().isEmpty().withMessage("The paymentcharges field is required!"),
    body('paymentgatewaycharges').not().isEmpty().withMessage("The paymentgatewaycharges field is required!"),
    body('created_by').not().isEmpty().withMessage("The created_by field is required!"),
    body('IsDelete').not().isEmpty().withMessage("The IsDelete field is required!"),


    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {


            payment.savePayment(req, res);
        }


    });


router.post('/viewpaymentdetails',
    body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            payment.viewpaymentbyvender(req, res);
        }

    });

//settlement

//save
router.post('/saveVenderSettlement',
    body('venderId').not().isEmpty().withMessage("The employ Name field is required!"),
    body('amountduedate').isLength({ max: 50 }).withMessage("The amountduedate field is required!"),
    body('amountlastpaiddate').not().isEmpty().withMessage("The amountlastpaiddate field is required!"),
    body('amountsettled').not().isEmpty().withMessage("The amountsettled field is required!"),
    body('pendingamount').not().isEmpty().withMessage("The amountsettled field is required!"),

    body('paymentgatewaycharges').not().isEmpty().withMessage("The paymentgatewaycharges field is required!"),

    body('created_by').not().isEmpty().withMessage("The mocreated_byde field is required!"),
    body('IsDelete').not().isEmpty().withMessage("The IsDelete field is required!"),


    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            payment.saveVenderSettlement(req, res);
        }

    });
//paid and all
router.post('/viewsettlementbybranchByVender',
    body('registerId').not().isEmpty().withMessage("The registerId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            payment.viewsettlementbybranchByVender(req, res);
        }

    });

//unapid by brach

router.post('/viewUnpaidAmountByVenderByBranchFilter',
    body('branchId').not().isEmpty().withMessage("The branchId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            payment.viewUnpaidAmountByVenderByBranchFilter(req, res);
        }

    });


//unpaid by registration

router.post('/viewUnpaidAmountByVenderByVenderFilter',
    body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            payment.viewUnpaidAmountByVenderByVenderFilter(req, res);
        }

    });


//Dashboard

router.post('/viewtotalbooking',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewtotalbooking(req, res);
        }

    });

router.post('/viewtotalbookingBybranch',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),
    body('branchId').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewtotalbookingbybranch(req, res);
        }

    });


router.post('/viewtotalbookingbyvender',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),
    body('registrationId').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewtotalbookingbyvender(req, res);
        }

    });


router.post('/viewviewtotalamountcollected',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewviewtotalamountcollected(req, res);
        }

    });


router.post('/viewviewtotalamountcollectedByBranch',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),
    body('branchId').not().isEmpty().withMessage("The enddate field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewviewtotalamountcollectedByBranch(req, res);
        }

    });

router.post('/viewviewtotalamountcollectedByVender',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),
    body('registrationId').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewviewtotalamountcollectedByVender(req, res);
        }

    });


router.post('/viewviewtotalamountcompanyshareBybranch',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),
    body('branchId').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewviewtotalamountcompanyshareBybranch(req, res);
        }

    });

router.post('/viewviewtotalamountcompanyshareByvender',
    body('startdate').not().isEmpty().withMessage("The startdate field is required!"),
    body('enddate').not().isEmpty().withMessage("The enddate field is required!"),
    body('registrationId').not().isEmpty().withMessage("The enddate field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            adminController.viewviewtotalamountcompanyshareByvender(req, res);
        }

    });

//vender count 

router.post('/viewonboaredvendercount',

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewonboardedvendercount(req, res);
        }

    });




router.post('/viewapprovedvendercount',

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewapprovedvendercount(req, res);
        }

    });





router.post('/viewblockedvendercount',

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewblockedvendercount(req, res);
        }

    });


router.post('/viewdeclinedvendercount',

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewdeclinedvendercount(req, res);
        }

    });


//by branch


router.post('/viewonboaredvendercountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewonboardedvendercountbybranch(req, res);
        }

    });


router.post('/viewapprovedvendercountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewapprovedvendercountbybranch(req, res);
        }

    });

router.post('/viewblockedvendercountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewblockedvendercountbybranch(req, res);
        }

    });


router.post('/viewdeclinedvendercountbybranch',
    body('branchName').not().isEmpty().withMessage("The branchName field is required!"),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {

            baseController.viewdeclinedvendercountbybranch(req, res);
        }

    });

//end service

module.exports = router;