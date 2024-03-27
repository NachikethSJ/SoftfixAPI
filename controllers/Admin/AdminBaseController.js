const adminBaseController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
adminBaseController.register = function (req, res) 
{
    
            db.query("insert into vendors(branchId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,country,state,city,created_by,IsDelete,status,review)values('"+req.body.branchName+"','"+req.body.shopName+"','"+req.body.mobile+"','"+req.body.let+"','"+req.body.lng+"','"+req.body.description+"','"+req.body.gstNo+"','"+req.body.pinNo+"','"+req.body.panNo+"','"+req.body.aadhaar+"','"+req.body.address+"','"+req.body.pin+"','"+req.body.country+"','"+req.body.state+"','"+req.body.city+"','"+req.body.created_by+"','0','0','0')", (err, result, fields) =>{
            if (err) throw err;
                config.response(200, 'Vender Successfully Registered!', result, res);
            });
      
    
}
adminBaseController.listrations = function (req, res) 
{

     db.query("select * from  vendors where IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully updated !', result, res);
    });
}

adminBaseController.InActiveListregistrionsForVendor = function (req, res) 
{

     db.query("select id,branchId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,file,country,state,city,status,token  from  vendors where status='"+req.body.status+"' and IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.ListregistrionsForVendor = function (req, res) 
{

     db.query("select id,branchId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,file,country,state,city,status,token,comment  from  vendors where mobile='"+req.body.mobile+"' and IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.ListViewregistrionsForVendor = function (req, res) 
{

     db.query("select vendors.id,branch.name as branchname,branch.id as branchId,vendors.name,vendors.mobile,vendors.lat,vendors.lng,vendors.description,vendors.gstNo,vendors.percentage ,vendors.tinNo,vendors.panNo,vendors.aadhaar,vendors.address,vendors.pin,vendors.file,vendors.country,vendors.state,vendors.city,vendors.status,vendors.comment from  vendors    inner join branch on vendors.branchId=branch.id    where  vendors.IsDelete='0' and branch.IsDelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.ListOfUnApprovedVendor = function (req, res) 
{

     db.query("select vendors.id,branch.name as branchname,branch.id as branchId,vendors.name,vendors.mobile,vendors.percentage, vendors.lat,vendors.lng,vendors.description,vendors.gstNo,vendors.tinNo,vendors.panNo,vendors.aadhaar,vendors.address,vendors.pin,vendors.file,vendors.country,vendors.state,vendors.city,vendors.status,vendors.comment from  vendors    inner join branch on vendors.branchId=branch.id    where  vendors.IsDelete='0' and branch.IsDelete='0' and branch.id='"+req.body.branchName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

//dashboard vender counts

adminBaseController.viewonboardedvendercount = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=0;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.viewapprovedvendercount = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=1;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.viewblockedvendercount = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=3;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.viewdeclinedvendercount = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=2;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


//dashboadrd by branch


adminBaseController.viewonboardedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors INNER JOIN branch ON branch.id = vendors.branchId where vendors.created_at between '"+req.body.startdate+"' and branch.id='"+req.body.branchId+"' and '"+req.body.enddate+"' and vendors.Isdelete='0' and branch.Isdelete='0' and vendors.status=0;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.viewapprovedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors INNER JOIN branch ON branch.id = vendors.branchId where vendors.created_at between '"+req.body.startdate+"' and branch.id='"+req.body.branchId+"' and '"+req.body.enddate+"' and vendors.Isdelete='0' and branch.Isdelete='0' and vendors.status=1;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.viewblockedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors INNER JOIN branch ON branch.id = vendors.branchId where vendors.created_at between '"+req.body.startdate+"' and branch.id='"+req.body.branchId+"' and '"+req.body.enddate+"' and vendors.Isdelete='0' and branch.Isdelete='0' and vendors.status=3;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.viewdeclinedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors INNER JOIN branch ON branch.id = vendors.branchId where vendors.created_at between '"+req.body.startdate+"' and branch.id='"+req.body.branchId+"' and '"+req.body.enddate+"' and vendors.Isdelete='0' and branch.Isdelete='0' and vendors.status=2;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}




//




adminBaseController.viewonboardedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=0;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.viewapprovedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=1;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.viewblockedapprovedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=3;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.viewdeclinedvendercountbybranch = function (req, res) 
{

     db.query("select count(*) as venderregistredcount from vendors    where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and IsDelete='0'  and status=2;", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

//

adminBaseController.ListOfApprovedVendor = function (req, res) 
{

     db.query("select vendors.id,branch.name as branchname,branch.id as branchId,vendors.percentage,vendors.name,vendors.mobile,vendors.lat,vendors.lng,vendors.description,vendors.gstNo,vendors.tinNo,vendors.panNo,vendors.aadhaar,vendors.address,vendors.pin,vendors.file,vendors.country,vendors.state,vendors.city,vendors.status,vendors.comment from  vendors    inner join branch on vendors.branchId=branch.id    where  vendors.status='1' and branch.IsDelete='0' and branch.id='"+req.body.branchName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminBaseController.ListOfBlockedVendor = function (req, res) 
{

     db.query("select vendors.id,vendors.percentage,branch.name as branchname,branch.id as branchId,vendors.name,vendors.mobile,vendors.lat,vendors.lng,vendors.description,vendors.gstNo,vendors.tinNo,vendors.panNo,vendors.aadhaar,vendors.address,vendors.pin,vendors.file,vendors.country,vendors.state,vendors.city,vendors.status,vendors.comment from  vendors    inner join branch on vendors.branchId=branch.id    where  vendors.status='3' and branch.IsDelete='0' and branch.id='"+req.body.branchName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminBaseController.registrationUpdate = function (req, res) 
{
     db.query("update vendors SET branchId='"+req.body.branchName+"',name='"+req.body.shopName+"',mobile='"+req.body.mobile+"',lat='"+req.body.let+"',lng='"+req.body.lng+"',description='"+req.body.description+"',gstNo='"+req.body.gstNo+"',tinNo='"+req.body.pinNo+"',panNo='"+req.body.panNo+"',aadhaar='"+req.body.aadhaar+"',address='"+req.body.address+"',pin='"+req.body.pin+"',country='"+req.body.country+"',state='"+req.body.state+"',city='"+req.body.city+"',updated_by='vender' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully updated !', result, res);
    });
}
// 1 approve  , 2 block , 0 unappoved
adminBaseController.registrationVendorApprove = function (req, res) 
{
     db.query("update vendors SET status='1' where mobile='"+req.body.mobile+"' and branchId='"+req.body.branchName+"'and name='"+req.body.shopName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender Successfully approved !', result, res);
    });
}

adminBaseController.registrationVendorBlock = function (req, res) 
{
     db.query("update vendors SET status='2' where mobile='"+req.body.mobile+"' and branchId='"+req.body.branchName+"'and name='"+req.body.shopName+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vendor Successfully blocked !', result, res);
    });
}

adminBaseController.registrationUpdateStatus = function (req, res) 
{
     db.query("update vendors SET  percentage='"+req.body.percentage+"', comment='"+req.body.comment+"' , status='"+req.body.status+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Vender updated Successfully  !', result, res);
    });
}

adminBaseController.registrationIsDelete = function (req, res) 
{
     db.query("update vendors SET IsDelete='1',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Deleted Successfully  !', result, res);
    });
}

adminBaseController.deletevendors = function (req, res) 
{
    db.query("DELETE FROM vendors WHERE id='"+req.body.id+"'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Vender Successfully Deleted!', result, res);
    });
    
}
adminBaseController.UploadImage=function(req, res)
{
    db.query("update vendors SET file='"+req.file.filename+"' where id='"+req.body.id+"'", (err, result, fields) =>{
    if (err) throw err;
        config.response(200, 'File Upload Success Successfully updated !', result, res);
    });
}


//Payment 


module.exports = adminBaseController;