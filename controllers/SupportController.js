const supportController = {};
const db =require("../db/connection");
const config = require('../config/config');


///  Store support  
supportController.storeSupport = async function (req, res) 
{
    db.query("insert into supports(name,message,created_by,IsDelete)values('"+req.body.name+"','"+req.body.message+"','"+req.body.registrationId+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Support Successfully Inserted !', result, res);
    });
}

///IsDelete Service Type 
supportController.IsDeletesupport = async function (req, res) 
{
    db.query("update supports SET IsDelete='"+1+"',updated_by='"+req.body.registrationId+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employ Successfully updated !', result, res);
    });
}

///  updated support  
supportController.updateSupport = async function (req, res) 
{
    db.query("update supports SET name='"+req.body.name+"',message='"+req.body.message+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Support Successfully Updated !', result, res);
    });
}

//Delete package
supportController.deleteSupport = function (req, res) 
{
    db.query("DELETE FROM supports WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Support Successfully Deleted!', result, res);
    });
    
}

//Fatch package
supportController.viewSupport = function (req, res) 
{
    db.query("select id,name,message,status,created_at from  supports where created_by='"+req.body.created_by+"' and Isdelete='0' order by created_at desc", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Supports Data Successfully Fatch !', result, res);
    });
    
}



module.exports = supportController;