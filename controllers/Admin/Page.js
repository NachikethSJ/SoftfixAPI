const pageController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

pageController.viewpage= function (req, res) 
{
     db.query("select id,name from  page where   Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page Fetched Successfully  !', result, res);
    });
}
pageController.storepage =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into page(name,created_by,created_at,IsDelete)values('"+req.body.name+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page Successfully added !', result, res);

    });
}
pageController.updatepage = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update page SET  name='"+req.body.name+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page Successfully updated !', result, res);
    });
   
}
pageController.updatepageisdelete = async function (req, res) 
{
    db.query("update page SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page Successfully deleted !', result, res);
    });
   
}

module.exports = pageController;