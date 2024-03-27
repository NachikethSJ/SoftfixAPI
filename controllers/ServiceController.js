const serviceController = {};
const db =require("../db/connection");
const config = require('../config/config');
const dotenv = require('dotenv');
const commonServices = require("../servicves/commonServices");
const errorLog = require("../config/logger");


//for Dashboard

serviceController.viewServiceandServiceType = function (req, res) 
{
     db.query("select  registrations.shopName, serviceid,service.serviceName,servicetype.type,servicetype.price,servicetype.offer,servicetype.persontype,servicetype.termAndcondition,servicetype.file,servicetype.rating,servicetype.status,servicetype.comment  from service  INNER JOIN servicetype ON service.id = servicetype.serviceId   inner join registrations on   service.shopId=registrations.id   where  service.Isdelete='0'      and registrations.Isdelete='0'  and servicetype.Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}

serviceController.viewService = function (req, res) 
{
     db.query("select  id,serviceName from service   where  mode='"+req.body.mode+"' and Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}

serviceController.storeService = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("insert into service(serviceName,shopId,created_by,IsDelete,mode,created_at)values('"+req.body.serviceName+"','"+req.body.shopId+"','"+req.body.registrationId+"','0','"+req.body.mode+"','"+datetime+"')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Successfully Inserted !', result, res);
    });
}

///update Service  
serviceController.Updatservice = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("update service SET mode='"+req.body.mode+"', serviceName='"+req.body.serviceName+"',updated_by='"+req.body.registrationId+"',updated_at='"+datetime+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


serviceController.viewOnlyService = function (req, res) 
{
     db.query("select id,serviceName from service where mode='"+req.body.mode+"' and shopId='"+req.body.registerId+"' and  IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Fetched Successfully !', result, res);
    });
}

///update Service  
serviceController.IsDeleteservice = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("update service SET IsDelete='"+1+"',updated_by='"+req.body.registrationId+",updated_at='"+datetime+"'' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}

serviceController.deleteService = function (req, res) 
{
    db.query("DELETE FROM service WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Service Successfully Deleted!', result, res);
    });
    
}

serviceController.baranchNameList = function (req, res) 
{
    
     db.query("select branchName from  registrations", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Baranch Name Successfully Fatch !', result, res);
    });
}

///  Store Service Type 
serviceController.storeServiceType = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("insert into servicetype(userId,serviceId,type,price,timeTaken,offer,details,persontype,termAndcondition,created_by,created_by,IsDelete,status)values('"+req.userId+"','"+req.body.serviceName+"','"+req.body.type+"','"+req.body.price+"','"+req.body.timeTaken+"','"+req.body.offer+"','"+req.body.details+"','"+req.body.persontype+"','"+req.body.termAndcondition+"','"+req.body.registrationId+"','"+datetime+"','0',0)", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Type Successfully Inserted !', result, res);
    });
}

///Approve servicetype
serviceController.Updatservicetypestatus = async function (req, res) 
{
    db.query("update servicetype SET status='"+req.body.status+"',comment='"+req.body.comment+"',updated_by='Admin' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


///Store Service Type 
serviceController.Updatservicetype = async function (req, res) 
{
    db.query("update servicetype SET serviceId='"+req.body.serviceName+"',type='"+req.body.type+"',price='"+req.body.price+"',timeTaken='"+req.body.timeTaken+"',offer='"+req.body.offer+"',details='"+req.body.details+"',persontype='"+req.body.persontype+"',persontype='"+req.body.persontype+"',termAndcondition='"+req.body.termAndcondition+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}

///IsDelete Service Type 
serviceController.IsDeleteservicetype = async function (req, res) 
{
    db.query("update servicetype SET IsDelete='"+1+"',updated_by='"+req.body.registrationId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


//selete service type
serviceController.deleteServiceType = function (req, res) 
{
    db.query("DELETE FROM servicetype WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Service type Successfully Deleted!', result, res);
    });
    
}
//show service type
serviceController.viewserviceType = function (req, res) 
{
     db.query("select id,serviceId,type,price,timeTaken,offer,details,persontype,termAndcondition,file  from  servicetype where Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'servicetype Data Fetched Successfully !', result, res);
    });
}


///
//show service type
serviceController.viewserviceTypeWithID = function (req, res) 
{
     db.query("select id,serviceId,type,price,timeTaken,offer,details,persontype,termAndcondition,file from  servicetype where serviceId='"+req.body.serviceId+"' and  Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'servicetype Data Fetched Successfully !', result, res);
    });
}
//show service type filter serviceId
serviceController.viewonlyserviceType = function (req, res) 
{
     db.query("select id,type from  servicetype where serviceId='"+req.body.serviceId+"' and  IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'servicetype Data Fetched Successfully !', result, res);
    });
}


//Service Name List
serviceController.serviceNameList = function (req, res) 
{
     db.query("select id,serviceName from  service", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Baranch Name Successfully Fatch !', result, res);
    });
}


//create service Token
serviceController.creatToken=(req, res)=>
{
    const token =config.generateAccessToken(req, res);
   
}

//create Country List
serviceController.countriesList = async (req, res)=> {
    try {
        const countries = await commonServices.getAll('country');
        return config.response(200, 'Country List has been get successfully!!', countries, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }   
}

//create States List
serviceController.statesList = async (req, res)=> {
    try {
        const states = await commonServices.getByCustomFieldMultiple('state','countryId',req?.body?.countryId);
        return config.response(200, 'State List has been get successfully!!', states, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }   
}

//create Cities List
serviceController.citiesList = async (req, res)=> {
    try {
        const cities = await commonServices.getByCustomFieldMultiple('city','stateId',req?.body?.stateId);
        return config.response(200, 'City List has been get successfully!!', cities, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }   
}

//create Branch List
serviceController.branchList = async (req, res)=> {
    try {
        const branches = await commonServices.getByCustomFieldMultiple('branch','cityId',req?.body?.cityId);
        return config.response(200, 'Branch List has been get successfully!!', branches, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }   
}

//create Branch List
serviceController.serviceTypeList = async (req, res)=> {
    try {
        const serviceTypes = await commonServices.getAll('service_types');
        return config.response(200, 'Service Types List has been get successfully!!', serviceTypes, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }   
}

module.exports = serviceController;