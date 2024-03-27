var express = require('express');
const fs = require('fs');
const authController = require('../controllers/employee/AuthController');
const { body } = require('express-validator');
const userValidation = require('../validation/userValidation');
const authenticateEmployee = require('../middleware/authenticateEmployee.js');
const shopController = require('../controllers/employee/ShopController.js');
const slotController = require('../controllers/employee/SlotController.js');
require('express-group-routes');
var router = express.Router();

/***************************LOGIN APIS START********************************************/
router.post('/login',
[
   body('mobile').not().isEmpty().withMessage("The mobile field is required!"),
   body('password').not().isEmpty().withMessage("The password field is required!"),
],
userValidation.validation,
authController.login
);
/***************************LOGIN APIS END********************************************/

router.use(authenticateEmployee);

/***************************SHOP LIST APIS START********************************************/

router.get('/shop',shopController.list);

/***************************SHOP LIST APIS END*********************************************/

/***************************SERVICE AND SUB SERVICES LIST APIS START********************************************/

router.get('/service',shopController.serviceList);

/***************************SERVICE AND SUB SERVICES LIST APIS END*********************************************/

/*************************** UPDATE SERVICE AND SUB SERVICES LIST APIS START********************************************/

router.post('/update-service',
[
   body("type").notEmpty().withMessage("type Field is Required")
   .custom((value) => {
      if (value == "get" || value == "set") {
        return true;
      }
      throw new Error("type must be get or set");
    }),
   // body('service').not().isEmpty().withMessage("The service field is required!"),
],
userValidation.validation,
shopController.updateService
);

/***************************UPDATE SERVICE AND SUB SERVICES LIST APIS END*********************************************/

/*************************** UPDATE SERVICE AND SUB SERVICES LIST APIS START********************************************/
router.group("/slot", (router) => {
   router.get('/condition-check',slotController.conditionCheck);

   router.post("/create", 
   [
      body('shopId').not().isEmpty().withMessage("The Shop Id field is required!"),
      body('dates').not().isEmpty().withMessage("The dates field is required!"),
      body('startTime').not().isEmpty().withMessage("The startTime field is required!"),
      body('endTime').not().isEmpty().withMessage("The endTime field is required!"),
      // body('status').not().isEmpty().withMessage("The status field is required!"),
   ],
   userValidation.validation,
   slotController.create
   ); 

   router.get("/",slotController.list);
   
   router.put("/update", 
   [
      body('id').not().isEmpty().withMessage("The Id field is required!"),
      body('shopId').not().isEmpty().withMessage("The Shop Id field is required!"),
      body('dates').not().isEmpty().withMessage("The dates field is required!"),
      body('startTime').not().isEmpty().withMessage("The startTime field is required!"),
      body('endTime').not().isEmpty().withMessage("The endTime field is required!"),
      // body('status').not().isEmpty().withMessage("The status field is required!"),
   ],
   userValidation.validation,
   slotController.update
   ); 

   router.delete("/delete",
   [
      body('id').not().isEmpty().withMessage("The Id field is required!")
   ],
   userValidation.validation,
   slotController.delete
   );
});

/***************************UPDATE SERVICE AND SUB SERVICES LIST APIS END*********************************************/

module.exports = router;