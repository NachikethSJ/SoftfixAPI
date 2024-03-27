const adminPaymentController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
adminPaymentController.viewpaymentbyvender = function (req, res) 
{
    db.query("select customerpaymentforcompanyreference.venderId ,vendors.name,vendors.id, service.serviceName,sub_services.type ,customerpaymentforcompanyreference.amountcollected, customerpaymentforcompanyreference.bookingdetaislId, customerpaymentforcompanyreference.paymentcharges, customerpaymentforcompanyreference.paymentgatewaycharges, customerpaymentforcompanyreference.created_by, customerpaymentforcompanyreference.created_at, customerpaymentforcompanyreference.updated_at ,customerpaymentforcompanyreference.updated_by, customerpaymentforcompanyreference.IsDelete from customerpaymentforcompanyreference inner join vendors on customerpaymentforcompanyreference.venderId=vendors.id inner join booking_details on booking_details.id=customerpaymentforcompanyreference.bookingdetaislId inner join sub_services on sub_services.id=booking_details.serviceTypeId inner join service on service.id=sub_services.serviceId where customerpaymentforcompanyreference.IsDelete='0' and service.IsDelete='0' and sub_services.IsDelete='0' and vendors.IsDelete='0' and vendors.id='"+req.body.registerId+"' and customerpaymentforcompanyreference.created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}



adminPaymentController.viewempolydropdown = function (req, res) 
{
     db.query("select id,employName  from  employee where mode='"+req.body.mode+"' and registerid='"+req.body.registerId+"' and Isdelete='0' and status='1' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}
adminPaymentController.savePayment = async function (req, res) 
{
 
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("insert into customerpaymentforcompanyreference(venderId,amountcollected,bookingdetaislId,paymentcharges,paymentgatewaycharges,created_by,created_at,IsDelete )values('"+req.body.venderId+"','"+req.body.amountcollected+"','"+req.body.bookingdetaislId+"','"+req.body.paymentcharges+"','"+req.body.paymentgatewaycharges+"','"+req.body.created_by+"','"+datetime+"','"+req.body.IsDelete+"')", (err, result, fields) =>{
        if (err) throw err;
       
            config.response(200, 'payment Successfully added !', result, res);
    });
}
adminPaymentController.updateemployee = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("update employee SET  mode='"+req.body.mode+"', status='"+req.body.status+"', employName='"+req.body.employName+"',registerId='"+req.body.registerId+"',password='"+encpass+"',mobile='"+req.body.mobile+"',pPassword='"+req.body.password+"',updated_by='"+req.body.registerId+"', updated_at='"+datetime+"',gender='"+req.body.gender+"',file='"+req.body.file+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
   
}
adminPaymentController.updateemployeeisdelete = async function (req, res) 
{
    db.query("update employee SET IsDelete='"+1+"',updated_by='"+req.body.registerId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully deleted !', result, res);
    });
   
}

adminPaymentController.deleteemployee = function (req, res) 
{
    db.query("DELETE FROM employee WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Employee Successfully Deleted!', result, res);
    });
    
}

//settlement

adminPaymentController.saveVenderSettlement = async function (req, res) 
{
 
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into paymentsettlementforcompanyandvender(venderId,amountduedate,amountlastpaiddate ,amountsettled, pendingamount,paymentgatewaycharges,created_by,created_at,IsDelete)values('"+req.body.venderId+"','"+req.body.amountduedate+"','"+req.body.amountlastpaiddate+"','"+req.body.amountsettled+"','"+req.body.pendingamount+"','"+req.body.paymentgatewaycharges+"','"+req.body.created_by+"','"+datetime+"','"+req.body.IsDelete+"')", (err, result, fields) =>{
        if (err) throw err;
       
            config.response(200, 'payment Successfully added !', result, res);
    });
}

//all paid and unpaid
adminPaymentController.viewsettlementbybranchByVender = function (req, res) 
{
    db.query("select paymentsettlementforcompanyandvender.venderId ,vendors.name,vendors.id as shopid ,paymentsettlementforcompanyandvender.amountduedate, paymentsettlementforcompanyandvender.amountlastpaiddate, paymentsettlementforcompanyandvender.amountsettled, paymentsettlementforcompanyandvender.pendingamount, paymentsettlementforcompanyandvender.paymentgatewaycharges, paymentsettlementforcompanyandvender.created_by, paymentsettlementforcompanyandvender.created_at, paymentsettlementforcompanyandvender.updated_at ,paymentsettlementforcompanyandvender.updated_by, paymentsettlementforcompanyandvender.IsDelete from paymentsettlementforcompanyandvender inner join vendors on paymentsettlementforcompanyandvender.venderId=vendors.id where paymentsettlementforcompanyandvender.IsDelete='0' and vendors.IsDelete='0' and vendors.id='"+req.body.registerId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Payment Fetched Successfully  !', result, res);
    });
}

//filter by branch unpaid

adminPaymentController.viewUnpaidAmountByVenderByBranchFilter = function (req, res) 
{
    db.query("select paymentsettlementforcompanyandvender.venderId ,vendors.name,vendors.id as shopid ,paymentsettlementforcompanyandvender.amountduedate, paymentsettlementforcompanyandvender.amountlastpaiddate, paymentsettlementforcompanyandvender.amountsettled, paymentsettlementforcompanyandvender.pendingamount, paymentsettlementforcompanyandvender.paymentgatewaycharges, paymentsettlementforcompanyandvender.created_by, paymentsettlementforcompanyandvender.created_at, paymentsettlementforcompanyandvender.updated_at ,paymentsettlementforcompanyandvender.updated_by, paymentsettlementforcompanyandvender.IsDelete from paymentsettlementforcompanyandvender inner join vendors on paymentsettlementforcompanyandvender.venderId=vendors.id inner join branch on vendors.branchId=branch.id where paymentsettlementforcompanyandvender.IsDelete='0' and vendors.IsDelete='0' and branch.id='"+req.body.branchId+"' and date_add(paymentsettlementforcompanyandvender.amountduedate,INTERVAL 7 DAY) < curdate() order by paymentsettlementforcompanyandvender.amountlastpaiddate desc", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Payment Fetched Successfully  !', result, res);
    });
}

//filter by vender

adminPaymentController.viewUnpaidAmountByVenderByVenderFilter = function (req, res) 
{
    db.query("select paymentsettlementforcompanyandvender.venderId ,vendors.name,vendors.id as shopid ,paymentsettlementforcompanyandvender.amountduedate, paymentsettlementforcompanyandvender.amountlastpaiddate, paymentsettlementforcompanyandvender.amountsettled, paymentsettlementforcompanyandvender.pendingamount, paymentsettlementforcompanyandvender.paymentgatewaycharges, paymentsettlementforcompanyandvender.created_by, paymentsettlementforcompanyandvender.created_at, paymentsettlementforcompanyandvender.updated_at ,paymentsettlementforcompanyandvender.updated_by, paymentsettlementforcompanyandvender.IsDelete from paymentsettlementforcompanyandvender inner join vendors on paymentsettlementforcompanyandvender.venderId=vendors.id where paymentsettlementforcompanyandvender.IsDelete='0' and vendors.IsDelete='0' and vendors.id='"+req.body.registrationId+"' and date_add(paymentsettlementforcompanyandvender.amountduedate,INTERVAL 7 DAY) < curdate() order by paymentsettlementforcompanyandvender.amountlastpaiddate desc", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Payment  Fetched Successfully  !', result, res);
    });
}


module.exports = adminPaymentController;