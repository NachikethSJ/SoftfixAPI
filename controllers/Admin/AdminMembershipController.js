const adminMembershipController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');
//const jwt = require('jsonwebtoken');
//dotenv.config();


///  Store Membership  
adminMembershipController.storeMembership = async function (req, res) 
{
    db.query("insert into memberships(userId,membershipName,packageId,startDate,endDate,price,serviceTypeId,offer,details,termAndcondition,created_by,mode)values('"+req.body.userId+"','"+req.body.membershipName+"','"+req.body.packageId+"','"+req.body.startDate+"','"+req.body.endDate+"','"+req.body.price+"','"+req.body.serviceTypeId+"','"+req.body.offer+"','"+req.body.details+"','"+req.body.termAndcondition+"','"+req.body.createdby+"','"+req.body.mode+"')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Successfully Inserted !', result, res);
    });

    
}



///  Update Membership  
adminMembershipController.updateMembership = async function (req, res) 
{
    db.query("update memberships SET mode='"+req.body.mode+"', membershipName='"+req.body.membershipName+"',packageId='"+req.body.packageId+"',startDate='"+req.body.startDate+"',endDate='"+req.body.endDate+"',price='"+req.body.price+"',details='"+req.body.details+"',termAndcondition='"+req.body.termAndcondition+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Successfully Updated !', result, res);
    });
}

///  IsDelete Membership  
adminMembershipController.isDeleteMembership = async function (req, res) 
{
      db.query("update membership_details SET IsDelete='"+1+"',updated_by='"+req.body.updatedby+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Successfully deleted !', result, res);
    });
}
//Delete Membership
adminMembershipController.deleteMembership = function (req, res) 
{
    db.query("DELETE FROM memberships WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Membership Successfully Deleted!', result, res);
    });
    
}

//Fatch Membership
adminMembershipController.viewMembership = function (req, res) 
{
    db.query("select id,membershipName,packageId,userId,startDate,endDate,price,serviceTypeId,offer,details,termAndcondition from  memberships where  mode='"+req.body.mode+"' and userId='"+req.body.userId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Data Fetched Successfully !', result, res);
    });
    
}

adminMembershipController.viewMembershipdropdown = function (req, res) 
{
    db.query("select id,membershipName from memberships where  mode='"+req.body.mode+"' and userId='"+req.body.userId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Data Fetched Successfully !', result, res);
    });
    
}


adminMembershipController.viewMembershipService = function (req, res) 
{
    db.query("select d.id, r.servicename,s.type,s.price,d.offer,s.timetaken,s.details,s.persontype,s.termandcondition,s.file from sub_services s  JOIN membership_details  d ON s.id = d.serviceTypeId join service r on r.id=s.serviceId where  d.IsDelete='0' and  d.membershipid='"+req.body.membershipId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Data Fetched Successfully !', result, res);
    });
    
}


///  Store Membership Details  
adminMembershipController.storeMembershipDetails = async function (req, res) 
{
    db.query("insert into membership_details(membershipId,serviceTypeId,offer,noOfTime,created_by,IsDelete)values('"+req.body.membershipId+"','"+req.body.serviceTypeId+"','"+req.body.offer+"','"+req.body.noOfTime+"','"+req.body.createdby+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Details Successfully Inserted !', result, res);
    });

    
}
///  Update Membership Details
adminMembershipController.updateMembershipDetails = async function (req, res) 
{
    db.query("update membership_details SET membershipId='"+req.body.membershipId+"',serviceTypeId='"+req.body.serviceTypeId+"',offer='"+req.body.offer+"',noOfTime='"+req.body.noOfTime+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership Details Successfully Updated !', result, res);
    });
}

adminMembershipController.updateMembershipDetailsStatus = async function (req, res) 
{
    db.query("update membership_details SET status='"+req.body.status+"',comment='"+req.body.comment+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Membership ststus Successfully Updated !', result, res);
    });
}
//Delete Membership Details
adminMembershipController.deleteMembershipDetails = function (req, res) 
{
    db.query("DELETE FROM membership_details WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Memberships Details Successfully Deleted!', result, res);
    });
    
}

//Fatch Membership Details
adminMembershipController.viewMembershipDetails = function (req, res) 
{
    db.query("select id,membershipId,serviceTypeId,offer,noOfTime  from  membership_details where membershipId='"+req.body.membershipId+"' and Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Memberships Details Data Successfully Fatch !', result, res);
    });
    
}

module.exports = adminMembershipController;