const cityController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

cityController.viewcity= function (req, res) 
{
     db.query("select city.id , city.name ,state.name as state,country.name as country ,country.id  as countryId,state.id as stateId    from city  INNER JOIN state ON city.stateid = state.id INNER JOIN country ON city.countryid = country.id where   city.Isdelete='0' and  country.Isdelete='0' and state.Isdelete='0' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'City Fetched Successfully  !', result, res);
    });
}

//filter state  based on country
cityController.viewcitybyState= function (req, res) 
{
     db.query("select city.id , city.name ,state.name as state,country.name as country ,country.id  as countryId,state.id as stateId    from city INNER JOIN state ON city.stateid = state.id INNER JOIN country ON city.countryid = country.id  where   city.Isdelete='0'  and  country.Isdelete='0' and state.Isdelete='0' and  state.id ='"+req.body.stateid+"' ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'City Fetched Successfully  !', result, res);
    });
}

cityController.storecity =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into city(name,countryid,stateid,created_by,created_at,IsDelete)values('"+req.body.name+"','"+req.body.countryid+"','"+req.body.stateid+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'City Successfully added !', result, res);

    });
}

cityController.updatecity = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update city SET  name='"+req.body.name+"',countryid='"+req.body.countryid+"',stateid='"+req.body.stateid+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'City Successfully updated !', result, res);
    });
   
}
cityController.updatecityisdelete = async function (req, res) 
{
    db.query("update city SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page Successfully deleted !', result, res);
    });
   
}

module.exports = cityController;