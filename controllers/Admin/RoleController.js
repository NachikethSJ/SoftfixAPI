const roleController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

roleController.viewrole= function (req, res) 
{
     db.query("select id,rolename from  role where   Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Role Fetched Successfully  !', result, res);
    });
}

roleController.storerole = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into role(rolename,created_by,created_at,IsDelete)values('"+req.body.rolename+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Role Successfully updated !', result, res);

    });
}

roleController.updaterole = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update role SET  rolename='"+req.body.rolename+"' ,updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Role Successfully updated !', result, res);
    });
   
}
roleController.updateroleisdelete = async function (req, res) 
{
    db.query("update role SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Role Successfully deleted !', result, res);
    });
   
}

module.exports = roleController;