const vendorController = {};
const db =require("../db/connection");
const config = require('../config/config');
const errorLog = require('../config/logger');
const commonServices = require('../servicves/commonServices');
const jwt = require('jsonwebtoken');

vendorController.register = async (req, res) => {
    try {
        // const { branchName, shopName, mobile, lat, lng, description, gstNo, tinNo, panNo, aadhaar, address, pin, country, state, city } = req?.body;
        const result = await commonServices.create('vendors',req?.body);
        if (result) {
            let shopId = await config.createShopId();
            await commonServices.create('shops',{...req?.body,vendorId:result?.insertId,shopId:shopId});
            return config.response(200, 'Vender Successfully Registered!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

vendorController.login = async (req,res) => {
    try {
        const user = await commonServices.getByCustomField('vendors','mobile',req?.body?.mobileNo);
        if (user) {
            if(user?.isDelete == 1) return config.response(201, 'No User Found!',{}, res);
            if(user?.status == 0 || user?.status == 2) return config.response(201, `${user?.status == 0 ? 'Your Account review is pending!!' : 'Your account has been rejected by administrator'}`,{}, res);
            let otp = Math.floor(1000 + Math.random() * 9000);
            await commonServices.update('vendors',user?.id,{otp:otp,otpTime:new Date()});
            config.sendMobileOtp(user?.mobile,otp);
            return config.response(200, 'Otp has been sent to your mobile!', {}, res);
        } else {
            return config.response(201, 'No User Found!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

vendorController.otpVerify = async (req,res) => {
    try {
        const user = await commonServices.getByCustomField('vendors','mobile',req?.body?.mobileNo);
        if (user) {
            if(user?.otp == Number(req?.body?.otp)) {
                let otpTime = new Date(user?.otpTime);
                otpTime.setMinutes(otpTime.getMinutes()+Number(process.env.VENDOR_EXPIRE_OTP_TIME_IN_MINUTES));
                if(new Date(otpTime) >= new Date()) {
                    let token = await jwt.sign({_id:user?.mobile}, process.env.TOKEN_SECRET)
                    await commonServices.update('vendors',user?.id,{otp:null,otpTime:null,token});
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

vendorController.listrations = function (req, res) 
{

     db.query("select * from  registrations where IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully updated !', result, res);
    });
}

vendorController.InActiveListregistrionsForVendor = function (req, res) 
{

     db.query("select id,branchName,shopName,mobile,let,lng,description,gstNo,pinNo,panNo,aadhaar,address,pin,file,country,state,city,status,token  from  registrations where status='"+req.body.status+"' and IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

vendorController.ListregistrionsForVendor = function (req, res) 
{

     db.query("select id,branchName,shopName,mobile,let,lng,description,gstNo,pinNo,panNo,aadhaar,address,pin,file,country,state,city,status,token,comment  from  registrations where mobile='"+req.body.mobile+"' and IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

vendorController.ListViewregistrionsForVendor = function (req, res) 
{

     db.query("select registrations.id,branch.name as branchname,branch.id as branchId,registrations.shopName,registrations.mobile,registrations.let,registrations.lng,registrations.description,registrations.gstNo,registrations.percentage ,registrations.pinNo,registrations.panNo,registrations.aadhaar,registrations.address,registrations.pin,registrations.file,registrations.country,registrations.state,registrations.city,registrations.status,registrations.comment from  registrations    inner join branch on registrations.branchName=branch.id    where  registrations.IsDelete='0' and branch.IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

vendorController.ListOfUnApprovedVendor = function (req, res) 
{

     db.query("select registrations.id,branch.name as branchname,branch.id as branchId,registrations.shopName,registrations.mobile,registrations.percentage, registrations.let,registrations.lng,registrations.description,registrations.gstNo,registrations.pinNo,registrations.panNo,registrations.aadhaar,registrations.address,registrations.pin,registrations.file,registrations.country,registrations.state,registrations.city,registrations.status,registrations.comment from  registrations    inner join branch on registrations.branchName=branch.id    where  registrations.IsDelete='0' and branch.IsDelete='0' and branch.id='"+req.body.branchName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

vendorController.ListOfApprovedVendor = function (req, res) 
{

     db.query("select registrations.id,branch.name as branchname,branch.id as branchId,registrations.percentage,registrations.shopName,registrations.mobile,registrations.let,registrations.lng,registrations.description,registrations.gstNo,registrations.pinNo,registrations.panNo,registrations.aadhaar,registrations.address,registrations.pin,registrations.file,registrations.country,registrations.state,registrations.city,registrations.status,registrations.comment from  registrations    inner join branch on registrations.branchName=branch.id    where  registrations.IsDelete='0' and branch.IsDelete='0' and branch.id='"+req.body.branchName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

vendorController.ListOfBlockedVendor = function (req, res) 
{

     db.query("select registrations.id,registrations.percentage,branch.name as branchname,branch.id as branchId,registrations.shopName,registrations.mobile,registrations.let,registrations.lng,registrations.description,registrations.gstNo,registrations.pinNo,registrations.panNo,registrations.aadhaar,registrations.address,registrations.pin,registrations.file,registrations.country,registrations.state,registrations.city,registrations.status,registrations.comment from  registrations    inner join branch on registrations.branchName=branch.id    where  registrations.IsDelete='0' and branch.IsDelete='0' and branch.id='"+req.body.branchName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


vendorController.registrationUpdate = function (req, res) 
{
     db.query("update registrations SET branchName='"+req.body.branchName+"',shopName='"+req.body.shopName+"',mobile='"+req.body.mobile+"',let='"+req.body.let+"',lng='"+req.body.lng+"',description='"+req.body.description+"',gstNo='"+req.body.gstNo+"',pinNo='"+req.body.pinNo+"',panNo='"+req.body.panNo+"',aadhaar='"+req.body.aadhaar+"',address='"+req.body.address+"',pin='"+req.body.pin+"',country='"+req.body.country+"',state='"+req.body.state+"',city='"+req.body.city+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully updated !', result, res);
    });
}
// 1 approve  , 2 block , 0 unappoved
vendorController.registrationVendorApprove = function (req, res) 
{
     db.query("update registrations SET status='1' where mobile='"+req.body.mobile+"' and branchName='"+req.body.branchName+"'and shopName='"+req.body.shopName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully approved !', result, res);
    });
}

vendorController.registrationVendorBlock = function (req, res) 
{
     db.query("update registrations SET status='2' where mobile='"+req.body.mobile+"' and branchName='"+req.body.branchName+"'and shopName='"+req.body.shopName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vendor Successfully blocked !', result, res);
    });
}

vendorController.registrationUpdateStatus = function (req, res) 
{
     db.query("update registrations SET  percentage='"+req.body.percentage+"', comment='"+req.body.comment+"' , status='"+req.body.status+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender updated Successfully  !', result, res);
    });
}

vendorController.registrationIsDelete = function (req, res) 
{
     db.query("update registrations SET IsDelete='1',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Deleted Successfully  !', result, res);
    });
}

vendorController.deleteregistrations = function (req, res) 
{
    db.query("DELETE FROM registrations WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Vender Successfully Deleted!', result, res);
    });
    
}
vendorController.UploadImage=function(req, res)
{
    db.query("update registrations SET file='"+req.file.filename+"' where id='"+req.body.id+"'", (err, result, fields) =>{
    if (err) throw err;
        config.response(200, 'File Upload Success Successfully updated !', result, res);
    });
}
module.exports = vendorController;