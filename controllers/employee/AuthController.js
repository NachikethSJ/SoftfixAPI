const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const bcrypt = require('bcrypt');

let authController = {};

authController.login = async (req,res) => {
    try {
        const result = await commonServices.getByCustomField('employee','mobile',req?.body?.mobile);
        if(result) {
            if(result?.status == 1 && result?.approvalByAdmin == 1) {
                if(await bcrypt.compare(req?.body?.password, result?.password)) {
                    return config.response(200, 'Login Successsfull!',{...result,token:await jwt.sign({_id:result?.mobile}, process.env.TOKEN_SECRET)}, res);
                } else {
                    return config.response(201, 'Invalid Credentials!',{}, res);
                }
            } else {
                return config.response(201, 'Your account is not Approved, Please Contact Administrator!',{}, res);
            } 
        }
        return config.response(201, 'invalid Mobile No!',{}, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

module.exports = authController;