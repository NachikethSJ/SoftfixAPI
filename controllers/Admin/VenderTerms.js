const venderTermsController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

venderTermsController.viewtermsbycity= function (req, res) 
{
     db.query("select vendortermsandcondition.id,vendortermsandcondition.Terms,city.Isdelete ,city.id as cityId,city.name as CityName,state.id as stateId,state.name as StateName,country.id as countryId,country.name as CountryName  from vendortermsandcondition       INNER JOIN city ON vendortermsandcondition.cityId = city.id  INNER JOIN state ON  city.stateId = state.id INNER JOIN country ON  state.countryId = country.id  where  vendortermsandcondition.cityId ='"+req.body.cityId+"' and vendortermsandcondition.Isdelete='0'  and country.Isdelete='0'  and city.Isdelete='0'  and state.Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender terms Fetched Successfully  !', result, res);
    });
}



venderTermsController.storevendortermsandcondition =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into vendortermsandcondition(cityId,Terms,created_by,created_at,IsDelete)values('"+req.body.cityId+"','"+req.body.Terms+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender terms Successfully added !', result, res);

    });
}

venderTermsController.updatevendortermsandcondition = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update vendortermsandcondition SET  Terms='"+req.body.Terms+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender terms Successfully updated !', result, res);
    });
   
}
venderTermsController.updatevendortermsandconditionisdelete = async function (req, res) 
{
    db.query("update vendortermsandcondition SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender terms Successfully deleted !', result, res);
    });
   
}

module.exports = venderTermsController;