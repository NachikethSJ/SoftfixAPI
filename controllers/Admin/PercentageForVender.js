const percentageController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

percentageController.viewpercentage= function (req, res) 
{
     db.query("select percentageforvender.id, percentageforvender.percentage  as percentage, vendors.name as name ,vendors.id as registrationsId from percentageforvender INNER JOIN vendors ON percentageforvender.venderId = vendors.id   where   percentageforvender.Isdelete='0' and vendors.Isdelete='0' select state.id, state.name as state,country.name as country ,country.id as countryId from state INNER JOIN country ON state.countryid = country.id  where   state.Isdelete='0' and country.Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'State Fetched Successfully  !', result, res);
    });
}

//filter state  based on country
percentageController.viewpercentagebyvender= function (req, res) 
{
     db.query("select percentageforvender.id, percentageforvender.percentage  as percentage, vendors.name as shopName ,vendors.id as registrationsId from percentageforvender INNER JOIN vendors ON percentageforvender.venderId = vendors.id   where   percentageforvender.Isdelete='0' and vendors.Isdelete='0' select state.id, state.name as state,country.name as country ,country.id as countryId from state INNER JOIN country ON state.countryid = country.id  where   state.Isdelete='0' and country.Isdelete='0'   and  vendors.id  ='"+req.body.registrationsid+"' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'percentage Fetched Successfully  !', result, res);
    });
}

percentageController.storepercentage =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into percentageforvender(venderId,percentage,created_by,created_at,IsDelete)values('"+req.body.venderid+"','"+req.body.percentage+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'percentage Successfully added !', result, res);

    });
}
percentageController.updatepercentage = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update percentageforvender SET  venderId='"+req.body.venderid+"',percentage='"+req.body.percentage+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'percentage Successfully updated !', result, res);
    });
   
}
percentageController.updatepercentageisdelete = async function (req, res) 
{
    db.query("update percentageforvender SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'percentage Successfully deleted !', result, res);
    });
   
}

module.exports = percentageController;