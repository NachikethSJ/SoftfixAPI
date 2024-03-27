var express = require("express");
var usercon = require("../controllers/UserController");
var router = express.Router();
const { check, body, validationResult } = require("express-validator");
const config = require("../config/config");
const userauthenticatetoken = require("../middleware/userauthenticatetoken");
var router = express.Router();
var service = require("../controllers/ServiceController");
var payment = require("../controllers/PaymentController");
const userValidation = require("../validation/userValidation");
const authController = require("../controllers/user/AuthController");
const shopController = require("../controllers/user/ShopController");



//// User Route  ////

/***************************LOGIN AND REGISTRATION APIS START********************************************/
router.post(
  "/login",
  [
    body("mobileNo")
      .not()
      .isEmpty()
      .withMessage("The mobileNo field is required!")
      .matches("^(0|91)?[6-9][0-9]{9}$")
      .withMessage("Please enter the valid mobile no")
      .isLength({ min: 10, max: 10 })
      .withMessage("mobile no must be 10 digit!"),
  ],
  userValidation.validation,
  authController.login
);

router.post(
  "/otp-verify",
  [
    body("mobileNo")
      .not()
      .isEmpty()
      .withMessage("The mobileNo field is required!")
      .matches("^(0|91)?[6-9][0-9]{9}$")
      .withMessage("Please enter the valid mobile no")
      .isLength({ min: 10, max: 10 })
      .withMessage("mobile no must be 10 digit!"),
    body("otp").not().isEmpty().withMessage("otp Number field is required!"),
  ],
  userValidation.validation,
  authController.otpVerify
);

// router.post(
//   "/profile-update",
//   [
//     body("mobileNo")
//       .not()
//       .isEmpty()
//       .withMessage("The mobileNo field is required!")
//       .matches("^(0|91)?[6-9][0-9]{9}$")
//       .withMessage("Please enter the valid mobile no")
//       .isLength({ min: 10, max: 10 })
//       .withMessage("mobile no must be 10 digit!"),
//     body("otp").not().isEmpty().withMessage("otp Number field is required!"),
//   ],
//   userValidation.validation,
//   authController.profileUpdate
// );

/***************************LOGIN AND REGISTRATION APIS END********************************************/
router.use(userauthenticatetoken);



/***************************SHOPS APIS START********************************************/

router.post(
  "/near-by-shop",
  [
    body("lat").not().isEmpty().withMessage("The lat field is required!"),
    body("lng").not().isEmpty().withMessage("The lng field is required!"),
    body("distance").optional().notEmpty().withMessage("The distance field must not be empty!"),
  ],
  userValidation.validation,
  shopController.nearByShop
);

router.post(
  "/near-by-services",
  [
    body("lat").not().isEmpty().withMessage("The lat field is required!"),
    body("lng").not().isEmpty().withMessage("The lng field is required!"),
    body("distance").optional().notEmpty().withMessage("The distance field must not be empty!"),
    body("price").optional().notEmpty().withMessage("The price field must not be empty!"),
    body("serviceTypeId").optional().notEmpty().withMessage("The serviceTypeId field must not be empty!"),
    body("offer").optional().notEmpty().withMessage("The offer field must not be empty!"),
  ],
  userValidation.validation,
  shopController.nearByServices
);

router.post(
  "/near-by-packages",
  [
    body("lat").not().isEmpty().withMessage("The lat field is required!"),
    body("lng").not().isEmpty().withMessage("The lng field is required!"),
    body("distance").optional().notEmpty().withMessage("The distance field must not be empty!"),
    body("price").optional().notEmpty().withMessage("The price field must not be empty!"),
    body("serviceTypeId").optional().notEmpty().withMessage("The serviceTypeId field must not be empty!"),
    body("offer").optional().notEmpty().withMessage("The offer field must not be empty!"),
  ],
  userValidation.validation,
  shopController.nearByPackages
);

router.post(
  "/near-by-memberships",
  [
    body("lat").not().isEmpty().withMessage("The lat field is required!"),
    body("lng").not().isEmpty().withMessage("The lng field is required!"),
    body("distance").optional().notEmpty().withMessage("The distance field must not be empty!"),
    body("price").optional().notEmpty().withMessage("The price field must not be empty!"),
    body("serviceTypeId").optional().notEmpty().withMessage("The serviceTypeId field must not be empty!"),
    body("offer").optional().notEmpty().withMessage("The offer field must not be empty!"),
  ],
  userValidation.validation,
  shopController.nearByMemberships
);

router.post(
  "/near-by-elements",
  [
    body("lat").not().isEmpty().withMessage("The lat field is required!"),
    body("lng").not().isEmpty().withMessage("The lng field is required!"),
    body("distance").optional().notEmpty().withMessage("The distance field must not be empty!"),
  ],
  userValidation.validation,
  shopController.nearByElements
);

// router.post(
//   "/get-slots-by-sub-service",
//   [
//     body("subServiceId").notEmpty().withMessage("The lat field is required!")
//   ],
//   userValidation.validation,
//   shopController.nearByElements
// );

router.post(
  "/get-slots-by-sub-service",
  [
    body("subServiceId").notEmpty().withMessage("The id field is required!"),
    body("date").notEmpty().withMessage("The date field is required!"),
    body("currentTime").notEmpty().withMessage("The currentTime field is required!"),
  ],
  userValidation.validation,
  shopController.getSlotsBySubService
);

/***************************SHOPS APIS END********************************************/

// Login User
router.post(
  "/userverification",
  body("otp").not().isEmpty().withMessage("The OTP field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.userVerification(req, res);
    }
  }
);

/*------------------------------User Section Start here -----------------------*/

router.post(
  "/viewshop",
  body("let").not().isEmpty().withMessage("The let field is required!"),
  body("lng").not().isEmpty().withMessage("The lng field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewShop(req, res);
    }
  }
);

//View Service with filter reggistrationId
router.post(
  "/viewonlyserviceforshop",
  body("shopId").not().isEmpty().withMessage("The shopId field is required!"),
  body("mode").not().isEmpty().withMessage("The mode field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewUserServiceForShop(req, res);
    }
  }
);

//View Service with filter reggistrationId
router.post(
  "/viewUserServiceForMainPage",
  body("mode").not().isEmpty().withMessage("The mode field is required!"),
  body("let").not().isEmpty().withMessage("The let field is required!"),
  body("lng").not().isEmpty().withMessage("The lng field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewUserServiceForMainPage(req, res);
    }
  }
);

router.post(
  "/viewUserServiceTypeDetails",
  body("id").not().isEmpty().withMessage("The id field is required!"),
  body("mode").not().isEmpty().withMessage("The mode field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewUserServiceTypeDetails(req, res);
    }
  }
);

router.post(
  "/viewUserServiceReview",
  body("id").not().isEmpty().withMessage("The id field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewUserServiceReview(req, res);
    }
  }
);

//View Service with filter reggistrationId
router.post(
  "/viewonlyservice",
  body("registerId")
    .not()
    .isEmpty()
    .withMessage("The registerId field is required!"),
  body("mode").not().isEmpty().withMessage("The mode field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      service.viewOnlyService(req, res);
    }
  }
);

//add Api
router.post("/offerpackagelist", (req, res) => {
  usercon.offerpackageList(req, res);
});

//// User Package List  ////

router.post("/membershiplist", (req, res) => {
  usercon.membershipList(req, res);
});

//// User Package List  ////

router.post("/getoffer", (req, res) => {
  usercon.getOffer(req, res);
});

router.post(
  "/storereview",
  body("comment").not().isEmpty().withMessage("The comment field is required!"),
  body("rate").not().isEmpty().withMessage("The rate field is required!"),
  body("user").not().isEmpty().withMessage("The user field is required!"),
  body("serviceId")
    .not()
    .isEmpty()
    .withMessage("The serviceId field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.storeReview(req, res);
    }
  }
);

// Insert Support
router.post(
  "/storesupportusers",
  body("name").not().isEmpty().withMessage("The Name field is required!"),
  body("message").not().isEmpty().withMessage("The message field is required!"),
  body("userId")
    .not()
    .isEmpty()
    .withMessage("The registrationId field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.storeSupportUsers(req, res);
    }
  }
);

router.post(
  "/viewsupportlistbyuser",
  body("created_by")
    .not()
    .isEmpty()
    .withMessage("The created_by field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewSupportUsers(req, res);
    }
  }
);

router.post(
  "/viewpackage",
  body("let").not().isEmpty().withMessage("The let field is required!"),
  body("lng").not().isEmpty().withMessage("The lng field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewUserPackage(req, res);
    }
  }
);

router.post(
  "/viewmembership",
  body("let").not().isEmpty().withMessage("The let field is required!"),
  body("lng").not().isEmpty().withMessage("The lng field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.viewUserMembership(req, res);
    }
  }
);

router.post("/viewuserservice", (req, res) => {
  usercon.viewUserService(req, res);
});

//slots
router.post("/showSlots", (req, res) => {
  usercon.showSlots(req, res);
});
//
router.post("/packagedetails", (req, res) => {
  usercon.packageDetails(req, res);
});
router.post("/servicedetails", (req, res) => {
  usercon.serviceDetails(req, res);
});
router.post("/membershipdetails", (req, res) => {
  usercon.membershipDetails(req, res);
});
//************************************** BOOKING *********************************************************************** */
// Booking Location
router.post(
  "/bookinglocation",
  body("lattitude")
    .not()
    .isEmpty()
    .withMessage("The lattitude field is required!"),
  body("longitude")
    .not()
    .isEmpty()
    .withMessage("The longitude field is required!"),
  body("userId").not().isEmpty().withMessage("The userId field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.bookingLocation(req, res);
    }
  }
);
router.post(
  "/bookinglocationupdate",
  body("lattitude")
    .not()
    .isEmpty()
    .withMessage("The lattitude field is required!"),
  body("longitude")
    .not()
    .isEmpty()
    .withMessage("The longitude field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.bookingLocationUpdate(req, res);
    }
  }
);
router.post("/bookinglocationdelete", (req, res) => {
  usercon.bookingLocationDelete(req, res);
});
router.post("/bookinglocationview", (req, res) => {
  usercon.bookingLocationView(req, res);
});


// Add Booking Details
router.post(
  "/bookingdetails",
  body("transactionID").optional().notEmpty().withMessage("The transactionID field must not be empty!"),
  body("bookingId").optional().notEmpty().withMessage("The bookingId field must not be empty!"),
  body("paymentStatus").optional().notEmpty().withMessage("The paymentStatus field must not be empty!"),
  body("bookingStatus").optional().notEmpty().withMessage("The bookingStatus field must not be empty!"),
  body("employeeId")
    .optional().notEmpty()
    .withMessage("The employeeId field  must not be empty!"),
  body("serviceTypeId")
    .optional().notEmpty()
    .withMessage("The serviceTypeId field  must not be empty!"),
  body("bookingDate")
    .optional().notEmpty()
    .withMessage("The bookingDate field  must not be empty!"),
  body("bookingStartTime")
    .optional().notEmpty()
    .withMessage("The bookingStartTime field  must not be empty!"),
  body("bookingEndTime")
    .optional().notEmpty()
    .withMessage("The bookingEndTime field  must not be empty!"),
  body("tax").optional().notEmpty().withMessage("The tax field  must not be empty!"),
  body("latitude")
    .optional().notEmpty()
    .withMessage("The latitude field  must not be empty!"),
  body("longitude")
    .optional().notEmpty()
    .withMessage("The longitude field  must not be empty!"),


  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {

      req.body.createdBy = req.user;
      req.body.updatedBy = req.user;
      req.body.created_at = new Date();
      req.body.updated_at = new Date();
      req.body.isDelete = false;
      if (req.body.transactionID) {
        req.body.transactionID = req.body.transactionID.trim();
      }
      const userId = req.user;
      usercon.addBooking(userId, req, res);

    }
  }
);

// Get Booking Details

router.get(
  "/getBookingDetailList",
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      const userId = req.user; // Get userId from authorization
      usercon.getBookingDetailList(userId, req, res); // Pass userId as an argument
    }
  }
);


router.post(
  "/bookingdetailsupdate",
  body("locationId")
    .not()
    .isEmpty()
    .withMessage("The locationId field is required!"),
  body("employeeId")
    .not()
    .isEmpty()
    .withMessage("The employeeId field is required!"),
  body("serviceTypeId")
    .not()
    .isEmpty()
    .withMessage("The serviceTypeId field is required!"),
  body("bookingDate")
    .not()
    .isEmpty()
    .withMessage("The bookingDate field is required!"),
  body("bookingStartTime")
    .not()
    .isEmpty()
    .withMessage("The bookingStartTime field is required!"),
  body("bookingEndTime")
    .not()
    .isEmpty()
    .withMessage("The bookingEndTime field is required!"),
  body("tax").not().isEmpty().withMessage("The tax field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.bookingDetailsUpdate(req, res);
    }
  }
);
router.post("/bookingdetailsdelete", (req, res) => {
  usercon.bookingDetailsDelete(req, res);
});
router.post(
  "/bookingdetailsview",
  body("userId").not().isEmpty().withMessage("The userId field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.bookingDetailsView(req, res);
    }
  }
);

//Status 0 -> Open , 1 -> booked  ,2-> Accepted by vender ,3-> Servce done ,4->Close
router.post(
  "/oldbookingdetailsview",
  body("userId").not().isEmpty().withMessage("The userId field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.OldbookingDetailsView(req, res);
    }
  }
);

router.post(
  "/historybookingdetailsview",
  body("userId").not().isEmpty().withMessage("The userId field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.HistorybookingDetailsView(req, res);
    }
  }
);

// Booking Location Details
router.post(
  "/autoCompleteSearch",
  body("search").not().isEmpty().withMessage("The search field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.autoCompleteSearch(req, res);
    }
  }
);

// reschdeuled
router.post(
  "/reschdeuled",
  body("serviceTypeId")
    .not()
    .isEmpty()
    .withMessage("The serviceTypeId field is required!"),
  body("bookingId")
    .not()
    .isEmpty()
    .withMessage("The bookingId field is required!"),
  body("oldBookingDate")
    .not()
    .isEmpty()
    .withMessage("The Old Booking Date field is required!"),
  body("oldBookingStartTime")
    .not()
    .isEmpty()
    .withMessage("The Old Booking StartTime field is required!"),
  body("oldBookingEndTime")
    .not()
    .isEmpty()
    .withMessage("The Old Booking EndTime field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.reschdeuled(req, res);
    }
  }
);
router.post(
  "/reschdeuledupdate",
  body("serviceTypeId")
    .not()
    .isEmpty()
    .withMessage("The serviceTypeId field is required!"),
  body("bookingId")
    .not()
    .isEmpty()
    .withMessage("The bookingId field is required!"),
  body("oldBookingDate")
    .not()
    .isEmpty()
    .withMessage("The Old Booking Date field is required!"),
  body("oldBookingStartTime")
    .not()
    .isEmpty()
    .withMessage("The Old Booking StartTime field is required!"),
  body("oldBookingEndTime")
    .not()
    .isEmpty()
    .withMessage("The Old Booking EndTime field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.reschdeuledUpdate(req, res);
    }
  }
);
router.post("/reschdeuleddelete", (req, res) => {
  usercon.reschdeuledDelete(req, res);
});
router.post("/reschdeuledview", (req, res) => {
  usercon.reschdeuledView(req, res);
});

// canclled
router.post(
  "/canclled",
  body("serviceTypeId")
    .not()
    .isEmpty()
    .withMessage("The serviceTypeId field is required!"),
  body("oldBookingDate")
    .not()
    .isEmpty()
    .withMessage("The Old Booking Date field is required!"),
  body("oldBookingStartTime")
    .not()
    .isEmpty()
    .withMessage("The Old Booking StartTime field is required!"),
  body("oldBookingEndTime")
    .not()
    .isEmpty()
    .withMessage("The Old Booking EndTime field is required!"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      usercon.canclled(req, res);
    }
  }
);
// router.post('/canclledupdate',(req, res) =>{
//     body('serviceTypeId').not().isEmpty().withMessage("The serviceTypeId field is required!"),
//     body('oldBookingDate').not().isEmpty().withMessage("The Old Booking Date field is required!"),
//     body('oldBookingStartTime').not().isEmpty().withMessage("The Old Booking StartTime field is required!"),
//     body('oldBookingEndTime').not().isEmpty().withMessage("The Old Booking EndTime field is required!"),
//     (req, res) =>{
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             config.response(400,'Validation Error!',{ errors: errors.array() },res);
//         }
//         else
//         {
//             usercon.canclledUpdate(req, res);
//         }
//     }

// });
// router.post('/canclleddelete',(req, res) =>{
//     usercon.canclledDelete(req, res);
// });
// router.post('/canclledview',(req, res) =>{
//     usercon.canclledView(req, res);
// });

//add Api
router.post("/offerpackagelist", (req, res) => {
  usercon.offerpackageList(req, res);
});

//// User Package List  ////
router.post("/membershiplist", (req, res) => {
  usercon.membershipList(req, res);
});
//payment

router.post(
  "/addpayment",
  body("venderId")
    .not()
    .isEmpty()
    .withMessage("The employ Name field is required!"),
  body("amountcollected")
    .isLength({ max: 50 })
    .withMessage("Max length is 50!"),
  body("bookingdetaislId")
    .not()
    .isEmpty()
    .withMessage("The Branch Name field is required!"),
  body("paymentcharges")
    .not()
    .isEmpty()
    .withMessage("The password field is required!"),
  body("paymentgatewaycharges")
    .not()
    .isEmpty()
    .withMessage("The mobile number field is required!"),
  body("created_by").not().isEmpty().withMessage("The mode field is required!"),
  body("IsDelete").not().isEmpty().withMessage("The file field is required!"),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      config.response(
        400,
        "Validation Error!",
        { errors: errors.array() },
        res
      );
    } else {
      payment.savePayment(req, res);
    }
  }
);

module.exports = router;
