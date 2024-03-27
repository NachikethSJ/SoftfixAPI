const branchController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

branchController.viewbranch= function (req, res) 
{
  db.query("select branch.id , branch.name as branch,country.name as country , state.name as state, city.name,country.id  as countryId,state.id as stateId,city.id as cityId   from branch  INNER JOIN country ON branch.countryid = country.id  INNER JOIN state ON branch.stateid = state.id   INNER JOIN city ON branch.cityid = city.id   where   city.Isdelete='0'  and  country.Isdelete='0' and state.Isdelete='0' and branch.Isdelete='0' ", (err, result, fields) =>{
    if (err) throw err;
    config.response(200, 'Branch Fetched Successfully  !', result, res);
  });
}

//filter state  based on country
branchController.viewbranchbyCity= function (req, res) 
{
  db.query("select branch.id , branch.name as branch,country.name as country , state.name as state, city.name,country.id  as countryId,state.id as stateId,city.id as cityId from branch INNER JOIN country ON branch.countryid = country.id INNER JOIN state ON branch.stateid = state.id INNER JOIN city ON branch.cityid = city.id where city.Isdelete='0' and  country.Isdelete='0' and state.Isdelete='0' and branch.Isdelete='0' and  city.id ='"+req.body.cityid+"' ", (err, result, fields) =>{
      if (err) throw err;
      config.response(200, 'Branch Fetched Successfully  !', result, res);
  });
}

branchController.storebranch =async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  db.query("insert into branch(name,countryid,stateid,cityid,created_by,created_at,IsDelete)values('"+req.body.name+"','"+req.body.countryid+"','"+req.body.stateid+"','"+req.body.cityid+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
      if (err) throw err;
      config.response(200, 'Branch Successfully added !', result, res);

  });
}

branchController.updatebranch = async function (req, res) 
{
  var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  db.query("update branch SET  name='"+req.body.name+"',countryid='"+req.body.countryid+"',stateid='"+req.body.stateid+"',cityid='"+req.body.cityid+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
      if (err) throw err;
      config.response(200, 'Branch Successfully updated !', result, res);
  });  
}

branchController.updatebranchisdelete = async function (req, res) 
{
  db.query("update branch SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
      if (err) throw err;
      config.response(200, 'Branch Successfully deleted !', result, res);
  });
}

module.exports = branchController;