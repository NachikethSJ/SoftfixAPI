const paymentController = {};
const db =require("../db/connection");
const config = require('../config/config');

paymentController.viewpaymentbyvender = function (req, res) 
{
     db.query("select customerpaymentforcompanyreference.venderId ,registrations.shopName,registrations.id, service.serviceName,servicetype.type ,customerpaymentforcompanyreference.amountcollected, customerpaymentforcompanyreference.bookingdetaislId, customerpaymentforcompanyreference.paymentcharges, customerpaymentforcompanyreference.paymentgatewaycharges, customerpaymentforcompanyreference.created_by, customerpaymentforcompanyreference.created_at, customerpaymentforcompanyreference.updated_at ,customerpaymentforcompanyreference.updated_by, customerpaymentforcompanyreference.IsDelete from customerpaymentforcompanyreference inner join registrations on customerpaymentforcompanyreference.venderId=registrations.id inner join booking_details on booking_details.id=customerpaymentforcompanyreference.bookingdetaislId inner join servicetype on servicetype.id=booking_details.serviceTypeId inner join service on service.id=servicetype.serviceId where customerpaymentforcompanyreference.IsDelete='0' and service.IsDelete='0' and servicetype.IsDelete='0' and registrations.IsDelete='0' and registrations.id='"+req.body.registerId+"' and customerpaymentforcompanyreference.created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}

paymentController.viewempolydropdown = function (req, res) 
{
     db.query("select id,employName  from  employee where mode='"+req.body.mode+"' and registerid='"+req.body.registerId+"' and Isdelete='0' and status='1' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}
paymentController.savePayment = async function (req, res) 
{
 
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("insert into customerpaymentforcompanyreference(venderId,amountcollected,bookingdetaislId,paymentcharges,paymentgatewaycharges,created_by,created_at,IsDelete )values('"+req.body.venderId+"','"+req.body.amountcollected+"','"+req.body.bookingdetaislId+"','"+req.body.paymentcharges+"','"+req.body.paymentgatewaycharges+"','"+req.body.created_by+"','"+datetime+"','"+req.body.IsDelete+"')", (err, result, fields) =>{
        if (err) throw err;
       
            config.response(200, 'payment Successfully added !', result, res);
    });
}
paymentController.updateemployee = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("update employee SET  mode='"+req.body.mode+"', status='"+req.body.status+"', employName='"+req.body.employName+"',registerId='"+req.body.registerId+"',password='"+encpass+"',mobile='"+req.body.mobile+"',pPassword='"+req.body.password+"',updated_by='"+req.body.registerId+"', updated_at='"+datetime+"',gender='"+req.body.gender+"',file='"+req.body.file+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
   
}
paymentController.updateemployeeisdelete = async function (req, res) 
{
    db.query("update employee SET IsDelete='"+1+"',updated_by='"+req.body.registerId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully deleted !', result, res);
    });
   
}

paymentController.deleteemployee = function (req, res) 
{
    db.query("DELETE FROM employee WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Employee Successfully Deleted!', result, res);
    });
    
}

//settlement

//filter by vender

paymentController.viewUnpaidAmountByVenderByVenderFilter = function (req, res) 
{
    db.query("select paymentsettlementforcompanyandvender.venderId ,registrations.shopName,registrations.id as shopid ,paymentsettlementforcompanyandvender.amountduedate, paymentsettlementforcompanyandvender.amountlastpaiddate, paymentsettlementforcompanyandvender.amountsettled, paymentsettlementforcompanyandvender.pendingamount, paymentsettlementforcompanyandvender.paymentgatewaycharges, paymentsettlementforcompanyandvender.created_by, paymentsettlementforcompanyandvender.created_at, paymentsettlementforcompanyandvender.updated_at ,paymentsettlementforcompanyandvender.updated_by, paymentsettlementforcompanyandvender.IsDelete from paymentsettlementforcompanyandvender inner join registrations on paymentsettlementforcompanyandvender.venderId=registrations.id inner join branch on registrations.branchName=branch.id where paymentsettlementforcompanyandvender.IsDelete='0' and registrations.IsDelete='0' and registrations.id='"+req.body.registrationsId+"' and date_add(paymentsettlementforcompanyandvender.amountduedate,INTERVAL 7 DAY) < curdate() order by paymentsettlementforcompanyandvender.amountlastpaiddate desc", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}


module.exports = paymentController;