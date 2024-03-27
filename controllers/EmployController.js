const employController = {};
const db =require("../db/connection");
const config = require('../config/config');

employController.viewempoly = function (req, res) 
{
     db.query("select id,employName,employNo,status,mobile,pPassword  from  employee where mode='"+req.body.mode+"' and registerid='"+req.body.registerId+"' and Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}

employController.viewempolydropdown = function (req, res) 
{
     db.query("select id,employName  from  employee where mode='"+req.body.mode+"' and registerid='"+req.body.registerId+"' and Isdelete='0' and status='1' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}
employController.storeemploy = async function (req, res) 
{
    const lastid=0;
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("insert into employee(employName,registerId,password,status,mobile,pPassword,created_at,created_by,IsDelete,mode)values('"+req.body.employName+"','"+req.body.registerId+"','"+encpass+"','"+req.body.status+"','"+req.body.mobile+"','"+req.body.password+"','"+datetime+"','"+req.body.registerId+"','0','"+req.body.mode+"')", (err, result, fields) =>{
        if (err) throw err;
        const empID='EMP-'+result.insertId;
         db.query("update employee SET employNo='"+empID+"' where id='"+result.insertId+"'", (err, result, fields) =>{
         if (err) throw err;
            config.response(200, 'employee Successfully Inserted !', result, res);
         });
    });
}
employController.updateemployee = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("update employee SET  mode='"+req.body.mode+"', status='"+req.body.status+"', employName='"+req.body.employName+"',registerId='"+req.body.registerId+"',password='"+encpass+"',mobile='"+req.body.mobile+"',pPassword='"+req.body.password+"',updated_by='"+req.body.registerId+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
   
}
employController.updateemployeeisdelete = async function (req, res) 
{
    db.query("update employee SET IsDelete='"+1+"',updated_by='"+req.body.registerId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully deleted !', result, res);
    });
   
}

employController.deleteemployee = function (req, res) 
{
    db.query("DELETE FROM employee WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Employee Successfully Deleted!', result, res);
    });
    
}
employController.baranchNameList = function (req, res) 
{
     db.query("select id,branchName from  registrations", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Branch Name Fetched Successfully !', result, res);
    });
}
module.exports = employController;