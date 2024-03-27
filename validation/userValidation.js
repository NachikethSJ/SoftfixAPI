const { validationResult } = require('express-validator');
const config = require('../config/config');
// const { responseWithoutData } = require("../helpers/helper.js");
let userValidation = {};

userValidation.validation = (req, res , next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            msg: errors?.array()[0]?.msg
        });

    }else{
        next();
    }
}

userValidation.uploadImageValdator = (req, res, next) => {
    // if (req.body.type === "vendor") {
        if(req?.file_error == undefined || req?.file_error == null || req?.file_error == '') {
            if (req.files?.length > 0) {
                next();
            } else {
                return config.response(201, 'Image field is required!', {}, res);
            }
        } else {
            return config.response(201, req?.file_error, {}, res);
        }
    // } else {
    //     return config.response(201, 'Type must be Vendor!', {}, res);
    // }
}
module.exports = userValidation;