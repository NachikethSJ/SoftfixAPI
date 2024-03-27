const stateController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

stateController.viewstate= function (req, res) 
{
     db.query("select state.id, state.name as state,country.name as country ,country.id as countryId from state INNER JOIN country ON state.countryid = country.id  where   state.Isdelete='0' and country.Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'State Fetched Successfully  !', result, res);
    });
}

//filter state  based on country
stateController.viewstatebycountry= function (req, res) 
{
     db.query("select state.id , state.name as state,country.name as country,country.id as countryId  from state INNER JOIN country ON state.countryid = country.id  where   state.Isdelete='0' and country.Isdelete='0'  and  country.id ='"+req.body.countryid+"' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'State Fetched Successfully  !', result, res);
    });
}

stateController.storestate =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into state(name,countryid,created_by,created_at,IsDelete)values('"+req.body.name+"','"+req.body.countryid+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'State Successfully added !', result, res);

    });
}
stateController.updatestate = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update state SET  name='"+req.body.name+"',countryid='"+req.body.countryid+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'State Successfully updated !', result, res);
    });
   
}
stateController.updatestateisdelete = async function (req, res) 
{
    db.query("update state SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'State Successfully deleted !', result, res);
    });
   
}

module.exports = stateController;