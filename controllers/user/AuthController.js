const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const jwt = require('jsonwebtoken');

let authController = {};



authController.login = async (req,res) => {
    try {
        const user = await commonServices.getByCustomField('users','mobile',req?.body?.mobileNo);
        if (user) {
            if(user?.isDelete == 1) return config.response(201, 'No User Found!',{}, res);
            //if(user?.status == 0 || user?.status == 2) return config.response(201, `${user?.status == 0 ? 'Your Account review is pending!!' : 'Your account has been rejected by administrator'}`,{}, res);
            let otp = Math.floor(1000 + Math.random() * 9000);
            await commonServices.update('users',user?.id,{otp:otp,otpTime:new Date()});
            config.sendMobileOtp(user?.mobile,otp);
            return config.response(200, 'Otp has been sent to your mobile!', {}, res);
        } else {
            let otp = Math.floor(1000 + Math.random() * 9000);
            const result = await commonServices.create('users',{mobile:req?.body?.mobileNo,otp:otp,otpTime:new Date()});
            return config.response(200, 'Otp has been sent to your mobile!', {}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

authController.otpVerify = async (req,res) => {
    try {
        const user = await commonServices.getByCustomField('users','mobile',req?.body?.mobileNo);
        if (user) {
            if(user?.otp == Number(req?.body?.otp)) {
                let otpTime = new Date(user?.otpTime);
                otpTime.setMinutes(otpTime.getMinutes()+Number(process.env.VENDOR_EXPIRE_OTP_TIME_IN_MINUTES));
                if(new Date(otpTime) >= new Date()) {
                    let token = await jwt.sign({_id:user?.mobile}, process.env.TOKEN_SECRET)
                    await commonServices.update('users',user?.id,{otp:null,otpTime:null,token});
                    return config.response(200, "Login Successfully.",{...user,token},res);
                } else {
                    return config.response(201, 'OTP Expired!',{}, res);
                }
            } else {
                return config.response(201, 'Incorrect OTP!',{}, res);
            }
        } else {
            return config.response(201, 'No User Found!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

module.exports = authController;