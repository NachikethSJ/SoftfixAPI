import { validationResult } from "express-validator";
import { errorResponse, responseWithoutData } from "../helpers/helper.js";
import { errorLog } from "../config/logger.js";

export const adminValiation = (req, res, next) => {
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



export const uploadImageValdator = (req, res, next) => {
    if (req.body.type === "Category" || req.body.type === "Product" || req.body.type === "Testimonial" || req.body.type === "CaseStudy" || req.body.type === "Logo" || req.body.type === "Doctor" || req.body.type === "Explore" || req.body.type === "SkinAndHair" || req.body.type === "Plan" || req.body.type == 'Notification') {
        if (req.file) {
            next(); 
        } else {
            responseWithoutData(res, 400, false, "Image field is required");
        }
    } else {
        responseWithoutData(res, 400, false, "Type must be Category,Testimonial,Plan,Notification CaseStudy and Product");
    }
}

export const uploadMultipleImageValdator = (req, res, next) => {
    if (req.body.type === "Product") {
        if (req.files.length>0) {
            next();
        } else {
            responseWithoutData(res, 400, false, "Images field is required");
        }
    } else {
        responseWithoutData(res, 400, false, "Type must be Product");
    }
}

export const uploadVideoValdator = (req, res, next) => {
    if (req.body.type === "SkinOCareJourney" || req.body.type === "Explore") {
        if (req.file) {
            next();
        } else {
            responseWithoutData(res, 400, false, "Vidoe field is required");
        }
    } else {
        responseWithoutData(res, 400, false, "Type must be SkinOCareJourney");
    }
}

