
const slotsController = {};
const db =require("../db/connection");
const config = require('../config/config');
const dotenv = require('dotenv');
//const jwt = require('jsonwebtoken');
//dotenv.config();



///  Store Service Type 
slotsController.storeslots = async function (req, res) 
{
    db.query("insert into slots(serviceTypeId,date,startTime,endTime,employeeId,created_by,IsDelete)values('"+req.body.serviceTypeId+"','"+req.body.date+"','"+req.body.startTime+"','"+req.body.endTime+"','"+req.body.employeeId+"','"+req.body.registrationId+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Type Successfully Inserted !', result, res);
    });
}

//Update Slots
slotsController.updateSlots = async function (req, res) 
{
    db.query("update slots SET serviceTypeId='"+req.body.serviceTypeId+"', date='"+req.body.date+"',startTime='"+req.body.startTime+"',endTime='"+req.body.endTime+"',employeeId='"+req.body.employeeId+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Type Successfully Inserted !', result, res);
    });
}

///IsDelete slots  
slotsController.IsDeleteSlots = async function (req, res) 
{
    db.query("update slots SET IsDelete='"+1+"',updated_by='"+req.body.registrationId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}


//selete service type
slotsController.deleteSlots = function (req, res) 
{
    db.query("DELETE FROM slots WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Slots Successfully Deleted!', result, res);
    });
    
}
//show service type

slotsController.slotsList = function (req, res) 
{
     db.query("select  r.serviceName,d.type,d.employName,d.id,d.serviceTypeId,d.serviceId, d.date,d.startTime,d.endTime,d.employeeId from  ( select s.id,t.type,s.serviceTypeId,t.serviceId,s.date,s.startTime, s.endTime,s.employeeId ,e.employName from  slots s JOIN  servicetype t on s.serviceTypeId=t.id join employee e on e.id =s.employeeId where s.serviceTypeId='"+req.body.serviceTypeId+"' and s.Isdelete='0' ) d   join service r on r.id=d.serviceId   ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'slots Data Successfully Fatch !', result, res);
    });
}

module.exports = slotsController;