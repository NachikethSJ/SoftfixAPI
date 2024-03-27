const adminServiceController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');


//for Dashboard

adminServiceController.viewServiceandServiceType = function (req, res) 
{
     db.query("select  vendors.name, serviceid,service.name,sub_services.type,sub_services.price,sub_services.offer,sub_services.persontype,sub_services.termAndcondition,sub_services.file,sub_services.rating,sub_services.status,sub_services.comment  from service  INNER JOIN sub_services ON service.id = sub_services.serviceId   inner join vendors on   service.shopId=vendors.id   where  service.Isdelete='0'      and vendors.Isdelete='0'  and sub_services.Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}

adminServiceController.viewService = function (req, res) 
{
     db.query("select  id,name from service   where  serviceTypeId='"+req.body.serviceTypeIds+"' and Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully fetched !', result, res);
    });
}
adminServiceController.viewServiceByvender = function (req, res) 
{
     db.query("select  service.id,service.name from service inner join vendors on service.shopId=vendors.id  where  service.mode='"+req.body.mode+"' and service.Isdelete='0'and  vendors.Isdelete='0' and  vendors.id='"+req.body.registrationsId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}

// view Service by Shop
adminServiceController.viewServiceByshop = function (req, res) 
{
     db.query("select  id,name from service where shopId='"+req.body.shopId+"' and Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}

//view SubService by Service
adminServiceController.viewSubServiceByservice = function (req, res) 
{
     db.query("select  id,type from sub_services where serviceId='"+req.body.serviceId+"' and Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}

adminServiceController.storeService = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("insert into service(name,shopId,userId,created_by,IsDelete,created_at,serviceTypeId)values('"+req.body.name+"','"+req.body.shopId+"','"+req.body.vendorId+"','"+req.body.createdby+"','0','"+datetime+"','"+req.body.servicetypeId+"')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Successfully Inserted !', result, res);
    });
}

///update Service  
adminServiceController.Updatservice = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("update service SET userId='"+req.body.vendorId+"', name='"+req.body.name+"',updated_by='"+req.body.userId+"',updated_at='"+datetime+"',serviceTypeId='"+req.body.servicetypeId+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


adminServiceController.viewOnlyService = function (req, res) 
{
     db.query("select id,name,serviceTypeId from service where shopId='"+req.body.shopId+"' and  IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Data Fetched Successfully !', result, res);
    });
}


///update Service  
adminServiceController.IsDeleteservice = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("update service SET IsDelete='"+1+"',updated_by='"+req.body.userId+"',updated_at='"+datetime+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}

adminServiceController.deleteService = function (req, res) 
{
    db.query("DELETE FROM service WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Service Successfully Deleted!', result, res);
    });
    
}

adminServiceController.baranchNameList = function (req, res) 
{
    
     db.query("select branchId from  vendors", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Baranch Name Successfully Fatch !', result, res);
    });
}

///  Store Service Type 
adminServiceController.storeServiceType = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    db.query("insert into sub_services(userId,serviceId,type,price,timeTaken,offer,details,persontype,termAndcondition,created_by,created_at,IsDelete,status)values('"+req.body.userId+"','"+req.body.serviceId+"','"+req.body.type+"','"+req.body.price+"','"+req.body.timeTaken+"','"+req.body.offer+"','"+req.body.details+"','"+req.body.persontype+"','"+req.body.termAndcondition+"','"+req.body.registrationId+"','"+datetime+"','0',0)", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Type Successfully Inserted !', result, res);
    });
}

///Approve sub_services
adminServiceController.Updatservicetypestatus = async function (req, res) 
{
    db.query("update sub_services SET status='"+req.body.status+"',comment='"+req.body.comment+"',updated_by='Admin' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


///Store Service Type 
adminServiceController.Updatservicetype = async function (req, res) 
{
    db.query("update sub_services SET serviceId='"+req.body.serviceName+"',type='"+req.body.type+"',price='"+req.body.price+"',timeTaken='"+req.body.timeTaken+"',offer='"+req.body.offer+"',details='"+req.body.details+"',persontype='"+req.body.persontype+"',persontype='"+req.body.persontype+"',termAndcondition='"+req.body.termAndcondition+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}

///IsDelete Service Type 
adminServiceController.IsDeleteservicetype = async function (req, res) 
{
    db.query("update sub_services SET IsDelete='"+1+"',updated_by='"+req.body.registrationId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


//selete service type
adminServiceController.deleteServiceType = function (req, res) 
{
    db.query("DELETE FROM sub_services WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Service type Successfully Deleted!', result, res);
    });
    
}
//show service type
adminServiceController.viewserviceType = function (req, res) 
{
     db.query("select id,serviceId,type,price,timeTaken,offer,details,persontype,termAndcondition,file  from  sub_services where Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'sub_services Data Fetched Successfully !', result, res);
    });
}


///
//show service type
adminServiceController.viewserviceTypeWithID = function (req, res) 
{
     db.query("select id,serviceId,type,price,timeTaken,offer,details,persontype,termAndcondition,file from  sub_services where serviceId='"+req.body.serviceId+"' and  Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'sub_services Data Fetched Successfully !', result, res);
    });
}
//show service type filter serviceId
adminServiceController.viewonlyserviceType = function (req, res) 
{
     db.query("select id,type from  sub_services where serviceId='"+req.body.serviceId+"' and  IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'sub_services Data Fetched Successfully !', result, res);
    });
}


//Service Name List
adminServiceController.serviceNameList = function (req, res) 
{
     db.query("select id,name from  service", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Baranch Name Successfully Fatch !', result, res);
    });
}


//create service Token
adminServiceController.creatToken=(req, res)=>
{
    const token =config.generateAccessToken(req, res);
   
}

module.exports = adminServiceController;