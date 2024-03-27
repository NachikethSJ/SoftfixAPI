var employ = require("../controllers/EmployController");
var service = require("../controllers/ServiceController");
var package = require("../controllers/PackageController");
var membership = require("../controllers/MembershipController");
var slots = require("../controllers/SlotsController");
var support = require("../controllers/SupportController");
var payment= require("../controllers/PaymentController"); 


const bodyParser = require('body-parser');
var vendorController = require("../controllers/VendorController");
const db =require("../db/connection");
const { check,body, validationResult } = require('express-validator');
const config = require('../config/config');
var express = require('express');
var router = express.Router();
///start authantication 
const authenticateToken = require('../middleware/authenticatetoken');
const userValidation = require("../validation/userValidation");
const commonServices = require("../servicves/commonServices");
const shopController = require("../controllers/vendor/shopController");
const shopServiceController = require("../controllers/vendor/ShopServiceController");
const shopSubServiceController = require("../controllers/vendor/ShopSubServiceController");
const packageController = require("../controllers/vendor/PackageController");
const membershipController = require("../controllers/vendor/MembershipController");
const employeeController = require("../controllers/vendor/EmployeeController");
require('express-group-routes');


/***************************LOGIN AND REGISTRATION APIS START********************************************/
router.post('/register',
    [
        body('branchId').not().isEmpty().withMessage("The Branch Id field is required!"),
        body('name').not().isEmpty().withMessage("The Name field is required!")
        .isLength({ max: 25 }).withMessage("Max name length is 25!"),
        body('tinNo').not().isEmpty().withMessage("The tin number field is required!")
        .isLength({ max: 11 }).withMessage("Max tin number length is 11!")
        .custom(async (tinNo) => {
            const user = await commonServices.getByCustomField('vendors','tinNo',tinNo);
            if (user) {
              throw new Error("TIN No already in Exist");
            } else {
              return true;
            }
        }),
        body('panNo').not().isEmpty().withMessage("The pan number field is required!")
        .matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !')
        .custom(async (panNo) => {
            const user = await commonServices.getByCustomField('vendors','panNo',panNo);
            if (user) {
              throw new Error("PAN No already in Exist");
            } else {
              return true;
            }
        }),
        body('mobile').not().isEmpty().withMessage("The mobile number field is required!")
        .matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !')
        .custom(async (mobile) => {
            const user = await commonServices.getByCustomField('vendors','mobile',mobile);
            if (user) {
              throw new Error("mobile No already in Exist");
            } else {
              return true;
            }
        }),
        body('description').not().isEmpty().withMessage("The description field is required!")
        .isLength({ max: 200 }).withMessage("Max description length is 200!"),
        body('gstNo').not().isEmpty().withMessage("The GST No field is required!")
        .isLength({ max: 20 }).withMessage("Max gst No length is 20 !")
        .custom(async (gstNo) => {
            const user = await commonServices.getByCustomField('vendors','gstNo',gstNo);
            if (user) {
              throw new Error("GST No already in Exist");
            } else {
              return true;
            }
        }),
        body('address').not().isEmpty().withMessage("The address field is required!"),
        body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!")
        .matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid aadhaar No !')
        .custom(async (aadhaar) => {
            const user = await commonServices.getByCustomField('vendors','aadhaar',aadhaar);
            if (user) {
              throw new Error("Aadhaar already in Exist");
            } else {
              return true;
            }
        }),
        body('country').not().isEmpty().withMessage("The country field is required!"),
        body('state').not().isEmpty().withMessage("The state field is required!"),
        body('city').not().isEmpty().withMessage("The city field is required!"),
        body('pin').not().isEmpty().withMessage("The pin field is required!"),
    ],
    userValidation.validation,
    vendorController.register
);
router.post('/login',
    [
        body('mobileNo').not().isEmpty().withMessage("Mobile Number field is required!")
        .isLength({ max: 10 }).withMessage("Max length is 10!"),
    ],
    userValidation.validation,
    vendorController.login
);

router.post('/otp-verify',
    [
        body('mobileNo').not().isEmpty().withMessage("Mobile Number field is required!")
        .isLength({ max: 10 }).withMessage("Max length is 10!"),
        body('otp').not().isEmpty().withMessage("otp Number field is required!"),
    ],
    userValidation.validation,
    vendorController.otpVerify
);
/***************************LOGIN AND REGISTRATION APIS END********************************************/


router.use(authenticateToken);

/***************************SHOPS APIS START********************************************/
router.group("/shop", (router) => {
    router.post("/create", 
    [
        body('branchId').not().isEmpty().withMessage("The Branch Id field is required!"),
        body('name').not().isEmpty().withMessage("The Name field is required!")
        .isLength({ max: 25 }).withMessage("Max name length is 25!"),
        body('tinNo').not().isEmpty().withMessage("The tin number field is required!")
        .isLength({ max: 11 }).withMessage("Max tin number length is 11!")
        .custom(async (tinNo) => {
            const user = await commonServices.getByCustomField('shops','tinNo',tinNo);
            if (user) {
              throw new Error("TIN No already in Exist");
            } else {
              return true;
            }
        }),
        body('panNo').not().isEmpty().withMessage("The pan number field is required!")
        .matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !')
        .custom(async (panNo) => {
            const user = await commonServices.getByCustomField('shops','panNo',panNo);
            if (user) {
              throw new Error("PAN No already in Exist");
            } else {
              return true;
            }
        }),
        body('mobile').not().isEmpty().withMessage("The mobile number field is required!")
        .matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !')
        .custom(async (mobile) => {
            const user = await commonServices.getByCustomField('shops','mobile',mobile);
            if (user) {
              throw new Error("mobile No already in Exist");
            } else {
              return true;
            }
        }),
        body('description').not().isEmpty().withMessage("The description field is required!")
        .isLength({ max: 200 }).withMessage("Max description length is 200!"),
        body('gstNo').not().isEmpty().withMessage("The GST No field is required!")
        .isLength({ max: 20 }).withMessage("Max gst No length is 20 !")
        .custom(async (gstNo) => {
            const user = await commonServices.getByCustomField('shops','gstNo',gstNo);
            if (user) {
              throw new Error("GST No already in Exist");
            } else {
              return true;
            }
        }),
        body('address').not().isEmpty().withMessage("The address field is required!"),
        body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!")
        .matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid aadhaar No !')
        .custom(async (aadhaar) => {
            const user = await commonServices.getByCustomField('shops','aadhaar',aadhaar);
            if (user) {
              throw new Error("Aadhaar already in Exist");
            } else {
              return true;
            }
        }),
        body('country').not().isEmpty().withMessage("The country field is required!"),
        body('state').not().isEmpty().withMessage("The state field is required!"),
        body('city').not().isEmpty().withMessage("The city field is required!"),
        body('pin').not().isEmpty().withMessage("The pin field is required!"),
    ],
    userValidation.validation,
    shopController.create
    ); 

    router.get("/",shopController.list);
    
    router.put("/update", 
    [
        body('id').not().isEmpty().withMessage("The Id field is required!"),
        body('branchId').not().isEmpty().withMessage("The Branch Id field is required!"),
        body('name').not().isEmpty().withMessage("The Name field is required!")
        .isLength({ max: 25 }).withMessage("Max name length is 25!"),
        body('tinNo').not().isEmpty().withMessage("The tin number field is required!")
        .isLength({ max: 11 }).withMessage("Max tin number length is 11!")
        .custom(async (tinNo,{req}) => {
            const user = await commonServices.getByCustomFieldWithNotEqualCustomField('shops','tinNo',tinNo,'id',req?.body?.id);
            if (user) {
              throw new Error("TIN No already in Exist");
            } else {
              return true;
            }
        }),
        body('panNo').not().isEmpty().withMessage("The pan number field is required!")
        .matches('[A-Z]{5}[0-9]{4}[A-Z]{1}$').withMessage('Invalid Pan No !')
        .custom(async (panNo,{req}) => {
            const user = await commonServices.getByCustomFieldWithNotEqualCustomField('shops','panNo',panNo,'id',req?.body?.id);
            if (user) {
              throw new Error("PAN No already in Exist");
            } else {
              return true;
            }
        }),
        body('mobile').not().isEmpty().withMessage("The mobile number field is required!")
        .matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !')
        .custom(async (mobile,{req}) => {
            const user = await commonServices.getByCustomFieldWithNotEqualCustomField('shops','mobile',mobile,'id',req?.body?.id);
            if (user) {
              throw new Error("mobile No already in Exist");
            } else {
              return true;
            }
        }),
        body('description').not().isEmpty().withMessage("The description field is required!")
        .isLength({ max: 200 }).withMessage("Max description length is 200!"),
        body('gstNo').not().isEmpty().withMessage("The GST No field is required!")
        .isLength({ max: 20 }).withMessage("Max gst No length is 20 !")
        .custom(async (gstNo,{req}) => {
            const user = await commonServices.getByCustomFieldWithNotEqualCustomField('shops','gstNo',gstNo,'id',req?.body?.id);
            if (user) {
              throw new Error("GST No already in Exist");
            } else {
              return true;
            }
        }),
        body('address').not().isEmpty().withMessage("The address field is required!"),
        body('aadhaar').not().isEmpty().withMessage("The aadhaar no field is required!")
        .matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid aadhaar No !')
        .custom(async (aadhaar,{req}) => {
            const user = await commonServices.getByCustomFieldWithNotEqualCustomField('shops','aadhaar',aadhaar,'id',req?.body?.id);
            if (user) {
              throw new Error("Aadhaar already in Exist");
            } else {
              return true;
            }
        }),
        body('country').not().isEmpty().withMessage("The country field is required!"),
        body('state').not().isEmpty().withMessage("The state field is required!"),
        body('city').not().isEmpty().withMessage("The city field is required!"),
        body('pin').not().isEmpty().withMessage("The pin field is required!"),
    ],
    userValidation.validation,
    shopController.update
    ); 

    router.delete("/delete",
    [
        body('id').not().isEmpty().withMessage("The Id field is required!")
    ],
    userValidation.validation,
    shopController.delete
    );
});
/***************************SHOPS APIS END********************************************/


/***************************SERVICES APIS START********************************************/
router.group("/service", (router) => {
    router.post("/create", 
    [
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceTypeId').not().isEmpty().withMessage("The Service Type field is required!"),
        body('name').not().isEmpty().withMessage("The Name field is required!")
        .isLength({ max: 25 }).withMessage("Max name length is 25!"),
    ],
    userValidation.validation,
    shopServiceController.create
    ); 

    router.get("/",shopServiceController.list);
    
    router.put("/update", 
    [
        body('id').not().isEmpty().withMessage("The id field is required!"),
        body('shopId').not().isEmpty().withMessage("The Service Type field is required!"),
        body('serviceTypeId').not().isEmpty().withMessage("The Service Type field is required!"),
        body('name').not().isEmpty().withMessage("The Name field is required!")
        .isLength({ max: 25 }).withMessage("Max name length is 25!"),
    ],
    userValidation.validation,
    shopServiceController.update
    ); 

    router.delete("/delete",
    [
        body('id').not().isEmpty().withMessage("The Id field is required!")
    ],
    userValidation.validation,
    shopServiceController.delete
    );
});
/***************************SERVICES APIS END********************************************/

/***************************SUB SERVICES APIS START********************************************/
router.group("/sub-service", (router) => {
    router.post("/create", 
    [
        body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
        body('type').not().isEmpty().withMessage("The Service Type field is required!"),
        body('price').not().isEmpty().withMessage("The price field is required!"),
        body('timeTaken').not().isEmpty().withMessage("The timeTaken field is required!"),
        body('offer').not().isEmpty().withMessage("The offer field is required!"),
        body('termAndcondition').not().isEmpty().withMessage("The termAndcondition field is required!"),
        body('persontype').not().isEmpty().withMessage("The persontype field is required!"),
        body('details').not().isEmpty().withMessage("The details field is required!"),
        body('file').not().isEmpty().withMessage("The file field is required!"),
    ],
    userValidation.validation,
    shopSubServiceController.create
    ); 

    router.get("/",shopSubServiceController.list);
    
    router.put("/update", 
    [
        body('id').not().isEmpty().withMessage("The id field is required!"),
        body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
        body('type').not().isEmpty().withMessage("The Service Type field is required!"),
        body('price').not().isEmpty().withMessage("The price field is required!"),
        body('timeTaken').not().isEmpty().withMessage("The timeTaken field is required!"),
        body('offer').not().isEmpty().withMessage("The offer field is required!"),
        body('termAndcondition').not().isEmpty().withMessage("The termAndcondition field is required!"),
        body('persontype').not().isEmpty().withMessage("The persontype field is required!"),
        body('details').not().isEmpty().withMessage("The details field is required!"),
        body('file').not().isEmpty().withMessage("The file field is required!"),
    ],
    userValidation.validation,
    shopSubServiceController.update
    ); 

    router.delete("/delete",
    [
        body('id').not().isEmpty().withMessage("The Id field is required!")
    ],
    userValidation.validation,
    shopSubServiceController.delete
    );
});
/***************************SUB SERVICES APIS END********************************************/

/***************************PACKAGE APIS START********************************************/
router.group("/package", (router) => {
    router.post("/create", 
    [
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
        body('packageName').not().isEmpty().withMessage("The packageName field is required!"),
        // .custom(async (packageName) => {
        //     const user = await commonServices.getByCustomField('packages','packageName',packageName);
        //     if (user) {
        //       throw new Error("packageName already in Exist");
        //     } else {
        //       return true;
        //     }
        // }),
        body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
        body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
        body('price').not().isEmpty().withMessage("The price field is required!"),
        body('discount').not().isEmpty().withMessage("The discount field is required!"),
        body('termAndcondition').not().isEmpty().withMessage("The termAndcondition field is required!"),
        body('details').not().isEmpty().withMessage("The details field is required!"),
        body('file').not().isEmpty().withMessage("The file field is required!"),
    ],
    userValidation.validation,
    packageController.create
    ); 

    router.get("/",packageController.list);
    
    router.put("/update", 
    [
        body('id').not().isEmpty().withMessage("The id field is required!"),
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
        body('packageName').not().isEmpty().withMessage("The packageName field is required!"),
        // .custom(async (packageName,{req}) => {
        //     const user = await commonServices.getByCustomFieldWithNotEqualCustomField('packages','packageName',packageName,'id',req?.body?.id);
        //     if (user) {
        //       throw new Error("packageName already in Exist");
        //     } else {
        //       return true;
        //     }
        // }),
        body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
        body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
        body('price').not().isEmpty().withMessage("The price field is required!"),
        body('discount').not().isEmpty().withMessage("The discount field is required!"),
        body('termAndcondition').not().isEmpty().withMessage("The termAndcondition field is required!"),
        body('details').not().isEmpty().withMessage("The details field is required!"),
        body('file').not().isEmpty().withMessage("The file field is required!"),
    ],
    userValidation.validation,
    packageController.update
    ); 

    router.delete("/delete",
    [
        body('id').not().isEmpty().withMessage("The Id field is required!")
    ],
    userValidation.validation,
    packageController.delete
    );
});
/***************************PACKAGE APIS END********************************************/

/***************************MEMBERSHIP APIS START********************************************/
router.group("/membership", (router) => {
    router.post("/create", 
    [
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
        body('subServiceId').not().isEmpty().withMessage("The subServiceId field is required!"),
        body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
        body('membershipName').not().isEmpty().withMessage("The membershipName field is required!"),
        // .custom(async (packageName) => {
        //     const user = await commonServices.getByCustomField('packages','packageName',packageName);
        //     if (user) {
        //       throw new Error("packageName already in Exist");
        //     } else {
        //       return true;
        //     }
        // }),
        body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
        body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
        body('price').not().isEmpty().withMessage("The price field is required!"),
        body('offer').not().isEmpty().withMessage("The offer field is required!"),
        body('termAndcondition').not().isEmpty().withMessage("The termAndcondition field is required!"),
        body('details').not().isEmpty().withMessage("The details field is required!"),
        body('file').not().isEmpty().withMessage("The file field is required!"),
        body('noOfTimes').not().isEmpty().withMessage("The noOfTimes field is required!"),
    ],
    userValidation.validation,
    membershipController.create
    ); 

    router.get("/",membershipController.list);
    
    router.put("/update", 
    [
        body('id').not().isEmpty().withMessage("The id field is required!"),
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
        body('subServiceId').not().isEmpty().withMessage("The subServiceId field is required!"),
        body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
        body('membershipName').not().isEmpty().withMessage("The membershipName field is required!"),
        // .custom(async (packageName) => {
        //     const user = await commonServices.getByCustomField('packages','packageName',packageName);
        //     if (user) {
        //       throw new Error("packageName already in Exist");
        //     } else {
        //       return true;
        //     }
        // }),
        body('startDate').not().isEmpty().withMessage("The startDate field is required!"),
        body('endDate').not().isEmpty().withMessage("The endDate field is required!"),
        body('price').not().isEmpty().withMessage("The price field is required!"),
        body('offer').not().isEmpty().withMessage("The offer field is required!"),
        body('termAndcondition').not().isEmpty().withMessage("The termAndcondition field is required!"),
        body('details').not().isEmpty().withMessage("The details field is required!"),
        body('file').not().isEmpty().withMessage("The file field is required!"),
        body('noOfTimes').not().isEmpty().withMessage("The noOfTimes field is required!"),
    ],
    userValidation.validation,
    membershipController.update
    ); 

    router.delete("/delete",
    [
        body('id').not().isEmpty().withMessage("The Id field is required!")
    ],
    userValidation.validation,
    membershipController.delete
    );
});
/***************************MEMBERSHIP APIS END********************************************/

/***************************EMPLOYEE APIS START********************************************/
router.group("/employee", (router) => {
    router.post("/create", 
    [
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
        body('employName').not().isEmpty().withMessage("The employName field is required!")
        .isLength({max: 50 }).withMessage("employName must be in less than 50 character!"),
        body('password').not().isEmpty().withMessage("The password field is required!")
        .isLength({min:6, max: 20 }).withMessage("password must be in between 6 to 20 character!"),
        body('mobile').not().isEmpty().withMessage("The mobile field is required!")
        .matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !')
        .custom(async (mobile) => {
            const user = await commonServices.getByCustomField('employee','mobile',mobile);
            if (user) {
              throw new Error("mobile No already in Exist");
            } else {
              return true;
            }
        }),
        body('gender').not().isEmpty().withMessage("The gender field is required!")
    ],
    userValidation.validation,
    employeeController.create
    ); 

    router.get("/",employeeController.list);
    
    router.put("/update", 
    [
        body('id').not().isEmpty().withMessage("The id field is required!"),
        body('shopId').not().isEmpty().withMessage("The shopId field is required!"),
        body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
        body('employName').not().isEmpty().withMessage("The employName field is required!")
        .isLength({max: 50 }).withMessage("employName must be in less than 50 character!"),
        // body('password').not().isEmpty().withMessage("The password field is required!")
        // .isLength({min:6, max: 20 }).withMessage("password must be in between 6 to 20 character!"),
        body('mobile').not().isEmpty().withMessage("The mobile field is required!")
        .matches('^(0|91)?[6-9][0-9]{9}$').withMessage('Invalid mobile No !')
        .custom(async (mobile,{req}) => {
            const user = await commonServices.getByCustomFieldWithNotEqualCustomField('employee','mobile',mobile,'id',req?.body?.id);
            if (user) {
              throw new Error("mobile No already in Exist");
            } else {
              return true;
            }
        }),
        body('gender').not().isEmpty().withMessage("The gender field is required!")
    ],
    userValidation.validation,
    employeeController.update
    ); 

    router.delete("/delete",
    [
        body('id').not().isEmpty().withMessage("The Id field is required!")
    ],
    userValidation.validation,
    employeeController.delete
    );
});
/***************************EMPLOYEE APIS END********************************************/
router.post('/viewregistrations',(req, res) =>{
    vendorController.listrations(req, res);
});



router.post('/ListregistrionsForVendor',
body('mobile').not().isEmpty().withMessage("The mobile field is required!"),
(req, res) =>{
    vendorController.ListregistrionsForVendor(req, res);
});


router.post('/InActiveListregistrionsForVendor',
body('status').not().isEmpty().withMessage("The status field is required!"),
(req, res) =>{
    vendorController.InActiveListregistrionsForVendor(req, res);
});


router.post('/registrationIsDelete',
body('id').not().isEmpty().withMessage("The id field is required!"),
body('updated_by').not().isEmpty().withMessage("The IsDelete field is required!"),
(req, res) =>{
    vendorController.registrationIsDelete(req, res);
});

router.post('/registrationUpdateStatus',
body('status').not().isEmpty().withMessage("The status field is required!"),
body('id').not().isEmpty().withMessage("The id field is required!"),
body('updated_by').not().isEmpty().withMessage("The IsDelete field is required!"),
(req, res) =>{
    vendorController.registrationUpdateStatus(req, res);
});

// Update User 
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
body('aadhaar').not().isEmpty().matches('^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)').withMessage('Invalid mobile No !'),
body('country').not().isEmpty().withMessage("The country field is required!"),
body('state').not().isEmpty().withMessage("The state field is required!"),
body('city').not().isEmpty().withMessage("The city field is required!"),

body('pin').not().isEmpty().withMessage("The pin field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    {   
        db.query("select * from registrations where mobile='"+req.body.mobile+"' or branchName='"+req.body.branchName+"' or branchName='"+req.body.branchName+"'", (err, result, fields) =>{
            if (err) throw err;
            if(result.length>0)
            {
                config.response(500, 'Service already Saved !', {}, res);
            }
            else
            {
                vendorController.registrationUpdate(req, res);(req, res);
            }
        })
       
    }
    
});

// Delete User
router.post('/deleteregistrations',(req, res) =>{
    vendorController.deleteregistrations(req, res);
});

/*------------------------------api Employee-----------------------*/

//View Empoly
router.post('/viewempolyee',
body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        employ.viewempoly(req, res);
    }
   
});

//View Empolydropdown
router.post('/viewempolyeedropdown',
body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        employ.viewempolydropdown(req, res);
    }
   
});

// Insert Empoly 
router.post('/addemployee',
body('employName').not().isEmpty().withMessage("The employ Name field is required!"),
body('employName').isLength({ max: 50 }).withMessage("Max length is 50!"),
body('registerId').not().isEmpty().withMessage("The Branch Name field is required!"),
body('password').not().isEmpty().withMessage("The password field is required!"),
body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        config.validateMobile(req.body.mobile,res);
        db.query("select * from  employee where mobile='"+req.body.mobile+"'", (err, result, fields) =>{
            if (err) throw err;
            if(result.length>0)
            {
                config.response(500, 'employee is already exist !', {}, res);
            }
            else
            {
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
body('registerId').not().isEmpty().withMessage("The Branch Name field is required!"),
body('password').not().isEmpty().withMessage("The password field is required!"),
body('mobile').not().isEmpty().withMessage("The mobile number field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        config.validateMobile(req.body.mobile,res);
        employ.updateemployee(req, res);
    }
});

// Delete Employ
router.post('/deleteemployee',(req, res) =>{
    employ.deleteemployee(req, res);
});

// Delete Employ

router.post('/isdeleteemployee',

body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
body('id').not().isEmpty().withMessage("The id field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        employ.updateemployeeisdelete(req, res);
    }
});

// Fatch Branch Name
router.post('/baranchnamelist',(req, res) =>{
    employ.baranchNameList(req, res);
});

/*------------------------------api Service-----------------------*/

//View Service
// router.post('/viewservice',(req, res) =>{
//     service.viewService(req, res);
// });

router.post('/viewservice',
body('mode').not().isEmpty().withMessage("The mode field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        service.viewService(req, res);
    }
   
});


//View Service with filter reggistrationId
router.post('/viewonlyservice',
body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        service.viewOnlyService(req, res);
    }
   
});


// Insert Empoly 
router.post('/storeservice',
body('serviceName').not().isEmpty().withMessage("The Service Name field is required!"),
body('serviceName').isLength({ max: 50 }).withMessage("Max length is 50!"),
body('shopId').not().isEmpty().withMessage("The shop Name field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        db.query("select * from  service where serviceName='"+req.body.serviceName+"'", (err, result, fields) =>{
            if (err) throw err;
            if(result.length>0)
            {
                config.response(500, 'Service Name is already exist !', {}, res);
            }
            else
            {
                service.storeService(req, res);
            }
        });
        //employ.storeemploy(req, res);
    }
});

// update service 
router.post('/updatservice',
body('id').not().isEmpty().withMessage("The id field is required!"),
body('serviceName').not().isEmpty().withMessage("The Service Name field is required!"),
body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),
body('mode').not().isEmpty().withMessage("The mode field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
            service.Updatservice(req, res);
    }
});

// IsDelete Employ
router.post('/isdeleteservice',

body('id').not().isEmpty().withMessage("The id field is required!"),
body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
            service.IsDeleteservice(req, res);
    }
});

// Delete Employ
router.post('/deleteservice',(req, res) =>{
    service.deleteService(req, res);
});

// Fatch Branch Name
router.post('/baranchnamelist',(req, res) =>{
    employ.baranchNameList(req, res);
});
/*------------------------------api Service Part 2-----------------------*/


// Insert Empoly 
router.post('/storeservicetype',
check(
    'price',
    'price must be a number'
).isFloat({ min:0 }),
check(
    'timeTaken',
    'Time Taken must be a number'
).isFloat({ min:0 }),
body('serviceName').not().isEmpty().withMessage("The Service Name field is required!"),
body('type').not().isEmpty().withMessage("The Service Type Name field is required!"),
body('price').not().isEmpty().withMessage("The price field is required!"),
body('timeTaken').not().isEmpty().withMessage("The Time Taken field is required!"),
body('details').not().isEmpty().withMessage("The details field is required!"),
body('persontype').not().isEmpty().withMessage("The persontype field is required!"),
//body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
            service.storeServiceType(req, res);
    }
});

// update Empoly 
router.post('/updatservicetype',
check(
    'price',
    'price must be a number'
).isFloat({ min:0 }),
check(
    'timeTaken',
    'Time Taken must be a number'
).isFloat({ min:0 }),
body('serviceName').not().isEmpty().withMessage("The Service Name field is required!"),
body('type').not().isEmpty().withMessage("The Service Type Name field is required!"),
body('price').not().isEmpty().withMessage("The price field is required!"),
body('timeTaken').not().isEmpty().withMessage("The Time Taken field is required!"),
body('details').not().isEmpty().withMessage("The details field is required!"),
body('persontype').not().isEmpty().withMessage("The persontype field is required!"),
//body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
            service.Updatservicetype(req, res);
    }
});


// get serviceId 
router.post('/viewservicetypebyId',
body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
            service.viewserviceTypeWithID(req, res);
    }
});

// isdelete service type 
router.post('/isdeleteservicetype',

body('id').not().isEmpty().withMessage("The id field is required!"),
body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
            service.IsDeleteservicetype(req, res);
    }
});


// Delete service type
router.post('/deleteServicetype',(req, res) =>{
    service.deleteServiceType(req, res);
});

// Fatch  service type
router.post('/viewservicetype',(req, res) =>{
    service.viewserviceType(req, res);
});

//View Service with filter registrationId
router.post('/viewonlyservicetype',
body('serviceId').not().isEmpty().withMessage("The serviceId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        service.viewonlyserviceType(req, res);
    }
   
});


// Fatch  service type
router.post('/servicenamelist',(req, res) =>{
    service.serviceNameList(req, res);
});

/*------------------------------api Slots-----------------------*/

// Insert Empoly 
router.post('/storeslots',
// body('date')
//   .not()
//   .isEmpty()
//   .matches('^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$')
//   .withMessage('nvalid day received in correct format dd/mm/yyy'),
body('startTime')
  .not()
  .isEmpty()
  .matches('^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$')
  .withMessage('time must be in correct format hh:mm'),
body('endTime')
  .not()
  .isEmpty()
  .matches('^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$')
  .withMessage('time must be in correct format hh:mm'),

//body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{ 
        if(req.body.startTime>req.body.endTime){
            config.response(400,'start time should be smaller!',{ },res);
        }
        else
        {
            db.query("select * from slots where date='"+req.body.date+"' AND startTime<='"+req.body.startTime+"' AND endTime>='"+req.body.endTime+"' AND employeeId='"+req.body.employeeId+"'", (err, result, fields) =>{
                if (err) throw err;
                if(result.length>0)
                {
                    config.response(500, 'Slots already Confirm !', {}, res);
                }
                else
                {
                    slots.storeslots(req, res);
                }
            });
            
        }
            
    }
});

// Insert Empoly 
router.post('/updateslots',
// body('date')
//   .not()
//   .isEmpty()
//   .matches('^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$')
//   .withMessage('nvalid day received in correct format dd/mm/yyy'),
body('startTime')
  .not()
  .isEmpty()
  .matches('^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$')
  .withMessage('time must be in correct format hh:mm'),
body('endTime')
  .not()
  .isEmpty()
  .matches('^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$')
  .withMessage('time must be in correct format hh:mm'),

//body('offer').not().isEmpty().withMessage("The Time Taken field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        if(req.body.startTime>req.body.endTime){
            config.response(400,'start time should be smaller!',{ },res);
        }
        else
        {
            db.query("select * from slots where date='"+req.body.date+"' AND startTime<='"+req.body.startTime+"' AND endTime>='"+req.body.endTime+"' ", (err, result, fields) =>{
                if (err) throw err;
                if(result.length>0)
                {
                    config.response(500, 'Slots already Confirm !', {}, res);
                }
                else
                {
                    slots.updateSlots(req, res);
                }
            });
            
        }
            
    }
});

//isdeleteslots

router.post('/isdeleteslots',
body('id').not().isEmpty().withMessage("The id field is required!"),
body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        slots.IsDeleteSlots(req, res);
    }
});

// Delete Employ
router.post('/deleteslots',(req, res) =>{
    slots.deleteSlots(req, res);
});

// Fatch slots Name
// router.post('/slotslist',(req, res) =>{
//     slots.slotsList(req, res);
// });

router.post('/slotslist',
body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        slots.slotsList(req, res);
        }
});




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
check('price','price must be a number').isFloat({ min: 0 }),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        if(req.body.startDate>req.body.endDate){
            config.response(400,'start date should be smaller!',{ },res);
        }
        else
        {
            db.query("select * from packages where packageName='"+req.body.packageName+"' AND startDate<='"+req.body.startDate+"' AND endDate>='"+req.body.endDate+"' ", (err, result, fields) =>{
                if (err) throw err;
                if(result.length>0)
                {
                    config.response(500, 'Package already Confirm !', {}, res);
                }
                else
                {
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
body('price').not().isEmpty().withMessage("The password field is required!"),
body('mode').not().isEmpty().withMessage("The mode is required!"),
check('price','price must be a number').isFloat({ min: 0 }),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        if(req.body.startDate>req.body.endDate){
            config.response(400,'start date should be smaller!',{ },res);
        }
        else
        {
            db.query("select * from packages where packageName='"+req.body.packageName+"' AND startDate<='"+req.body.startDate+"' AND endDate>='"+req.body.endDate+"' ", (err, result, fields) =>{
                if (err) throw err;
                if(result.length>0)
                {
                    config.response(500, 'Package already Confirm !', {}, res);
                }
                else
                {
                    package.updatePackage(req, res);
                }
            });
            
        }
    }
});

// Delete Employ
router.post('/deletepackage',(req, res) =>{
    package.deletePackage(req, res);
});

// Fatch slots Name
// router.post('/packagelist',(req, res) =>{
//     package.viewPackage(req, res);
// });


// fetch package 
router.post('/packagelist',
body('userId').not().isEmpty().withMessage("The userId field is required!"),
body('mode').not().isEmpty().withMessage("The mode is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
          package.viewPackage(req, res);
        
    }
});

router.post('/packagelistbyservice',
body('packageid').not().isEmpty().withMessage("The packageid field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
          package.viewPackageNameByService(req, res);
        
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
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    {  
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
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    { 
        package.updatePackageDetails(req, res);  
    }
});


//Is Delete PackageDetails

router.post('/isdeletepackagedetails',
body('id').not().isEmpty().withMessage("The Id field is required!"),
body('updated_by').not().isEmpty().withMessage("The updated_by field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    { 
        package.IsDeletePackageDetails(req, res);  
    }
});

// Delete Package Details 
router.post('/deletepackagedetails',(req, res) =>{
    package.deletePackageDetails(req, res);
});

// Fatch Package Details 
// router.post('/packagelistdetails',(req, res) =>{
//     package.viewPackageDetails(req, res);
// });


router.post('/packagelistdetails',
body('packageId').not().isEmpty().withMessage("The packageId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    { 
        package.viewPackageDetails(req, res);  
    }
});

router.post('/packagelistfordropdown',
body('userId').not().isEmpty().withMessage("The userId field is required!"),
body('mode').not().isEmpty().withMessage("The mode is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
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
check('price','price must be a number').isFloat({ min: 0 }),

    check(
        'offer',
        'Offer must be a number'
    ).isFloat({ min: 0 }),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        if(req.body.startDate>req.body.endDate){
            config.response(400,'start date should be smaller!',{ },res);
        }
        else
        {
            db.query("select * from memberships where membershipName='"+req.body.membershipName+"' AND startDate<='"+req.body.startDate+"' AND endDate>='"+req.body.endDate+"' ", (err, result, fields) =>{
                if (err) throw err;
                if(result.length>0)
                {
                    config.response(500, 'Membershipalready Confirm !', {}, res);
                }
                else
                {
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
check('price','price must be a number').isFloat({ min: 0 }),
check('actualPrice','Actual Price must be a number').isFloat({ min: 0 }),
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

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        if(req.body.startDate>req.body.endDate){
            config.response(400,'start date should be smaller!',{ },res);
        }
        else
        {
            db.query("select * from memberships where membershipName='"+req.body.membershipName+"' AND startDate<='"+req.body.startDate+"' AND endDate>='"+req.body.endDate+"' ", (err, result, fields) =>{
                if (err) throw err;
                if(result.length>0)
                {
                    config.response(500, 'Membership already Confirm !', {}, res);
                }
                else
                {
                    membership.updateMembership(req, res);
                }
            });
            
        }
    }
});

// IsDelete Empoly 
router.post('/isdeleteMembership',
body('id').not().isEmpty().withMessage("The id is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    {    
     membership.isDeleteMembership(req, res);
    }
    });

// Delete Employ
router.post('/deleteMembership',(req, res) =>{
    membership.deleteMembership(req, res);
});

// Fatch slots Name
// router.post('/membershiplist',(req, res) =>{
//     membership.viewMembership(req, res);
// });


router.post('/membershiplistservice',
body('membershipId').not().isEmpty().withMessage("The membershipId field is required!"),
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
          membership.viewMembershipService(req, res);
        
    }
});


router.post('/membershiplist',
body('mode').not().isEmpty().withMessage("The mode is required!"),
body('userId').not().isEmpty().withMessage("The userId is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    {    
     membership.viewMembership(req, res);
    }
    });

    router.post('/membershiplistdropdown',
    body('mode').not().isEmpty().withMessage("The mode is required!"),
    body('userId').not().isEmpty().withMessage("The userId is required!"),
    
    (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400,'Validation Error!',{ errors: errors.array() },res);
        }
        else
        {    
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
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    {  
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
(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    { 
        membership.updateMembershipDetails(req, res);  
    }
});

// Delete Membership Details 
router.post('/deletemembershipdetails',(req, res) =>{
    membership.deleteMembershipDetails(req, res);
});

// Fatch Membership Details 
// router.post('/membershipdetailslistdetails',(req, res) =>{
//     membership.viewMembershipDetails(req, res);
// });


//
router.post('/membershipdetails',
body('membershipId').not().isEmpty().withMessage("The membershipId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else
    { 
        membership.viewMembershipDetails(req, res);  
    }
});

/*------------------------------Support -----------------------*/

// Insert Support 
router.post('/storesupport',
body('name').not().isEmpty().withMessage("The Name field is required!"),
body('message').not().isEmpty().withMessage("The message field is required!"),
body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else{ 
        
        support.storeSupport(req, res);
    }
});

// update support 
router.post('/updatesupport',
body('name').not().isEmpty().withMessage("The Name field is required!"),
body('message').not().isEmpty().withMessage("The message field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else{ 
        
        support.updateSupport(req, res);
    }
});

// Delete support
router.post('/deletesupport',(req, res) =>{
    support.deleteSupport(req, res);
});


// isdelete support Empoly 
router.post('/isdeletesupport',

body('id').not().isEmpty().withMessage("The id field is required!"),
body('registrationId').not().isEmpty().withMessage("The registrationId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        support.IsDeletesupport(req, res);
    }
});


// Fatch support
// router.post('/supportlist',(req, res) =>{
//     support.viewSupport(req, res);
// });


router.post('/supportlistbyvendor',
body('created_by').not().isEmpty().withMessage("The created_by field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }
    else{ 
        
        support.viewSupport(req, res);
    }
});

//payment

router.post('/viewpaymentdetails',
body('registerId').not().isEmpty().withMessage("The registerId field is required!"),
body('startdate').not().isEmpty().withMessage("The registerId field is required!"),
body('enddate').not().isEmpty().withMessage("The registerId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        payment.viewpaymentbyvender(req, res);
    }
   
});


//settlement
router.post('/viewUnpaidAmountByVenderByVenderFilter',
body('registrationId').not().isEmpty().withMessage("The branchId field is required!"),

(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400,'Validation Error!',{ errors: errors.array() },res);
    }else{  
        
        payment.viewUnpaidAmountByVenderByVenderFilter(req, res);
    }
   
});


module.exports = router;