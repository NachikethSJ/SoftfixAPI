const adminServiceTypeController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');


adminServiceTypeController.viewServiceType = function (req, res) 
{
     db.query("select  id,name from service_types where  Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Service Type Data Successfully fetched !', result, res);
    });
}


//create service Token
adminServiceTypeController.creatToken=(req, res)=>
{
    const token =config.generateAccessToken(req, res);
   
}

module.exports = adminServiceTypeController;