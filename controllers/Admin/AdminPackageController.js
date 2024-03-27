
const adminPackageController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');
//const jwt = require('jsonwebtoken');
//dotenv.config();

///  Store Package  
adminPackageController.storePackage = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("insert into packages(userId,packageName,startDate,endDate,price,details,discount,file,termAndcondition,created_by,created_at,mode,shopId,serviceId)values('"+req.body.userId+"','"+req.body.packageName+"','"+req.body.startDate+"','"+req.body.endDate+"','"+req.body.price+"','"+req.body.details+"','"+req.body.discount+"','"+req.body.file+"','"+req.body.terms+"','"+req.body.created_by+"','"+datetime+"' ,'"+req.body.mode+"','"+req.body.shopId+"','"+req.body.serviceId+"')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'package Successfully Inserted !', result, res);
    });
}
///  Update Package  
adminPackageController.updatePackage = async function (req, res) 
{
    db.query("update packages SET mode='"+req.body.mode+"', packageName='"+req.body.packageName+"',startDate='"+req.body.startDate+"',endDate='"+req.body.endDate+"',price='"+req.body.price+"',userId='"+req.body.userId+"',details='"+req.body.details+"',discount='"+req.body.discount+"',file='"+req.body.file+"',termAndcondition='"+req.body.terms+"',shopId='"+req.body.shopId+"'serviceId='"+req.body.serviceId+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'package Successfully Updated !', result, res);
    });
}

//Delete package
adminPackageController.deletePackage = function (req, res) 
{
    db.query("DELETE FROM packages WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Package Successfully Deleted!', result, res);
    });
    
}

adminPackageController.storePackageDetails = async function (req, res) 
{
    db.query("insert into package_details(packageId,serviceTypeId,offer,created_by,IsDelete)values('"+req.body.packageId+"','"+req.body.serviceTypeId+"','"+req.body.offer+"','"+req.body.created_by+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'package  Details Successfully Inserted !', result, res);
    });
}
///  Update Package  Details
adminPackageController.updatePackageDetails = async function (req, res) 
{
    db.query("update package_details SET packageId='"+req.body.packageId+"',serviceTypeId='"+req.body.serviceTypeId+"',offer='"+req.body.offer+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Package Details Successfully Updated !', result, res);
    });
}


///  Update Package  Details
adminPackageController.updatePackageDetailsStatus = async function (req, res) 
{
    db.query("update package_details SET status='"+req.body.status+"',comment='"+req.body.comment+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Package Details Successfully Updated !', result, res);
    });
}

///  IsDelete Package  Details
adminPackageController.IsDeletePackageDetails = async function (req, res) 
{
    db.query("update package_details SET IsDelete='"+1+"',updated_by='"+req.body.updatedby+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Package Details Successfully Updated !', result, res);
    });
}

//Delete package Details
adminPackageController.deletePackageDetails = function (req, res) 
{
    db.query("DELETE FROM package_details WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Package Details Successfully Deleted!', result, res);
    });
    
}
//Fatch package Details
adminPackageController.viewPackageDetails = function (req, res) 
{
    db.query("select id,packageId,serviceTypeId,offer from  package_details where packageId='"+req.body.packageId+"' and Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'packages Details Fetched Data Successfully !', result, res);
    });
    
}

//Fatch package
adminPackageController.viewPackage = function (req, res) 
{
    db.query("select id,userId,packageName,startDate,endDate,price,details,details,termAndcondition from  packages where  mode='"+req.body.mode+"' and userId='"+req.body.userId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'packages Data Successfully Fatch !', result, res);
    });
    
}

adminPackageController.viewAllPackage = function (req, res) 
{
    db.query("select id,userId,packageName,startDate,endDate,price,details,details,termAndcondition from  packages", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'packages Data Successfully Fatch !', result, res);
    });
    
}

adminPackageController.viewPackageNameDropDown = function (req, res) 
{
    db.query("select id,packageName from  packages where  mode='"+req.body.mode+"' and userId='"+req.body.userId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'packages Data Successfully Fatch !', result, res);
    });
    
}

adminPackageController.viewPackageNameByService = function (req, res) 
{
    db.query("select d.id, r.servicename, s.type,s.price,d.offer,s.timetaken,s.details,s.persontype,s.termandcondition,s.file from sub_services s  JOIN package_details  d ON s.id = d.serviceTypeId join service r on r.id=s.serviceId where d.IsDelete='0' and  d.packageid='"+req.body.packageid+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Package Details Successfully Fatch !', result, res);
    });
    
}




//Fatch package
adminPackageController.viewPackageForDropDown = function (req, res) 
{
    db.query("select id,packageName from  packages where  mode='"+req.body.mode+"' and userId='"+req.body.userId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'packages Data Successfully Fatch !', result, res);
    });
    
}

module.exports = adminPackageController;