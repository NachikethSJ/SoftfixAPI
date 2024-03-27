const userTermsController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

userTermsController.viewUsertermsbycity= function (req, res) 
{
     db.query("select usertermsandcondition.id ,  usertermsandcondition.Terms,city.id as cityId,city.name as CityName,state.id as stateId,state.name as StateName,country.id as countryId,country.name as CountryName  from usertermsandcondition INNER JOIN city ON usertermsandcondition.cityId = city.id   INNER JOIN state ON   city.stateId = state.id    INNER JOIN country ON  state.countryId = country.id       where   usertermsandcondition.cityId ='"+req.body.cityId+"' and       usertermsandcondition.Isdelete='0'  and country.Isdelete='0'  and city.Isdelete='0'  and state.Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'User terms Fetched Successfully  !', result, res);
    });
}



userTermsController.storeusertermsandcondition =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into usertermsandcondition(cityId,Terms,created_by,created_at,IsDelete)values('"+req.body.cityId+"','"+req.body.Terms+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'User terms Successfully added !', result, res);

    });
}

userTermsController.updateusertermsandcondition = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update usertermsandcondition SET  Terms='"+req.body.Terms+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'User terms Successfully updated !', result, res);
    });
   
}
userTermsController.updateusertermsandconditionisdelete = async function (req, res) 
{
    db.query("update usertermsandcondition SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'User terms Successfully deleted !', result, res);
    });
   
}

module.exports = userTermsController;