const pageAccessController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');

pageAccessController.viewaccess= function (req, res) 
{
     db.query("select id,pageid,C,R,U,D,roleId  from  pageaccess where   Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page details Fetched Successfully  !', result, res);
    });
}
pageAccessController.viewaccessByPage= function (req, res) 
{
     db.query("select id,pageid,C,R,U,D,roleId  from  pageaccess where pageid='"+req.body.pageid+"' and  Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page details Fetched Successfully  !', result, res);
    });
}
pageAccessController.viewaccessByPageByRole= function (req, res) 
{
     db.query("select id,pageid,C,R,U,D,roleId  from  pageaccess where pageid='"+req.body.pageid+"' and roleId='"+req.body.roleId+"' and  Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page details Fetched Successfully  !', result, res);
    });
}

pageAccessController.storepageaccess = async function (req, res) 
{
    const lastid=0;
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into pageaccess(pageid,C,R,U,D,created_at,created_by,IsDelete,roleId)values('"+req.body.pageid+"','"+req.body.C+"','"+req.body.R+"','"+req.body.U+"','"+req.body.D+"','"+datetime+"','"+req.body.created_by+"','0','"+req.body.roleId+"')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page access Successfully inserted !', result, res);

    });
}
pageAccessController.updatepageaccess = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
   
    db.query("update pageaccess SET  C='"+req.body.C+"', R='"+req.body.R+"',U='"+req.body.U+"',D='"+req.body.D+"',roleId='"+req.body.roleId+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"' and  Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page access Successfully updated !', result, res);
    });   
}

pageAccessController.updatepageaccessloginisdelete = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update pageaccess SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"',updated_at='"+datetime+"' where id='"+req.body.id+"'  and  Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Page access Successfully deleted !', result, res);
    });
   
}



module.exports = pageAccessController;