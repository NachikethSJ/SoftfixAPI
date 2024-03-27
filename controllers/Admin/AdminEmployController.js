const adminEmployController = {};
const db =require("../../db/connection");
const config = require('../../config/config');


adminEmployController.viewempoly = function (req, res) 
{
     db.query("select employee.employId as employId,employee.userId as userId, employee.serviceTypeId as serviceTypeId,employee.mode as mode,employee.gender as gender, employee.file as file, employee.id as employeeId,employee.employName,employee.status,shops.id as shopid, employee.mobile,employee.pPassword ,branch.id as branchId,branch.name as branchname, city.id as cityId, city.name as cityname, vendors.id as vendorID, shops.name as shopsname , state.id as stateId ,state.name as statename, country.id as countryId ,country.name as countryName from employee INNER JOIN shops ON shops.id = employee.shopId INNER JOIN vendors ON vendors.id = shops.vendorId INNER JOIN branch ON branch.id = vendors.branchId INNER JOIN city ON branch.cityId = city.id INNER JOIN state ON city.stateId = state.id INNER JOIN country ON state.countryId = country.id where employee.mode='"+req.body.mode+"' and employee.shopId='"+req.body.registerId+"' and vendors.Isdelete='0' and employee.Isdelete='0' and branch.Isdelete='0' and city.Isdelete='0' and state.Isdelete='0' and country.Isdelete='0' and shops.IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}

adminEmployController.storeemploy = async function (req, res) 
{
    const lastid=0;
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("insert into employee(employName,employId,userId,shopId,password,status,mobile,pPassword,created_at,created_by,IsDelete,mode,gender,file,serviceTypeId)values('"+req.body.employName+"','"+req.body.employId+"','"+req.body.userId+"','"+req.body.shopId+"','"+encpass+"','"+req.body.status+"','"+req.body.mobile+"','"+req.body.password+"','"+datetime+"','"+req.body.registerId+"','0','"+req.body.mode+"','"+req.body.gender+"','"+req.body.file+"','"+req.body.serviceTypeId+"')", (err, result, fields) =>{
        if (err) throw err;
        const empID='EMP-'+result.insertId;
         db.query("update employee SET employId='"+empID+"' where id='"+result.insertId+"'", (err, result, fields) =>{
         if (err) throw err;
            config.response(200, 'employee Successfully Inserted !', result, res);
         });
    });
}
adminEmployController.updateemployee = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("update employee SET  mode='"+req.body.mode+"', status='"+req.body.status+"', employName='"+req.body.employName+"',employId='"+req.body.employId+"',userId='"+req.body.userId+"',shopId='"+req.body.shopId+"',password='"+encpass+"',mobile='"+req.body.mobile+"',pPassword='"+req.body.password+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"',gender='"+req.body.gender+"',file='"+req.body.file+"',serviceTypeId='"+req.body.serviceTypeId+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
   
}
adminEmployController.updateemployeeisdelete = async function (req, res) 
{
    db.query("update employee SET IsDelete='"+1+"',updated_by='"+req.body.registerId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully deleted !', result, res);
    });
   
}

adminEmployController.approvedeclainemployee = async function (req, res) 
{
    db.query("update employee SET status ='"+req.body.adminstatus+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
   
}

adminEmployController.deleteemployee = function (req, res) 
{
    db.query("DELETE FROM employee WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Employee Successfully Deleted!', result, res);
    });
    
}
adminEmployController.baranchNameList = function (req, res) 
{
     db.query("select id,branchId from  vendors", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Branch Name Fetched Successfully !', result, res);
    });
}


module.exports = adminEmployController;