const adminShopController = {};
const db = require("../../db/connection");
const config = require('../../config/config');
adminShopController.register = function (req, res) {

    db.query("insert into shops(branchId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,country,state,city,created_by,IsDelete,status,review)values('" + req.body.branchName + "','" + req.body.shopName + "','" + req.body.mobile + "','" + req.body.let + "','" + req.body.lng + "','" + req.body.description + "','" + req.body.gstNo + "','" + req.body.pinNo + "','" + req.body.panNo + "','" + req.body.aadhaar + "','" + req.body.address + "','" + req.body.pin + "','" + req.body.country + "','" + req.body.state + "','" + req.body.city + "','" + req.body.created_by + "','0','0','0')", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully Registered!', result, res);
    });


}
adminShopController.listrations = function (req, res) {

    db.query("select * from  shops where IsDelete='0' and vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully updated !', result, res);
    });
}

adminShopController.InActiveListregistrionsForVendor = function (req, res) {

    db.query("select id,branchId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,file,country,state,city,status,token  from  shops where status='" + req.body.status + "' and IsDelete='0' and vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.ListregistrionsForVendor = function (req, res) {

    db.query("select id,branchId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,file,country,state,city,status,token,comment  from  shops where mobile='" + req.body.mobile + "' and IsDelete='0' and vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.ListViewregistrionsForVendor = function (req, res) {

    db.query("select shops.id,branch.name as branchname,branch.id as branchId,shops.name,shops.mobile,shops.lat,shops.lng,shops.description,shops.gstNo,shops.percentage ,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.IsDelete='0' and branch.IsDelete='0' and vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.ListOfUnApprovedVendor = function (req, res) {

    db.query("select shops.id,branch.name as branchname,branch.id as branchId,shops.name,shops.mobile,shops.percentage, shops.lat,shops.lng,shops.description,shops.gstNo,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.IsDelete='0' and branch.IsDelete='0' and branch.id='" + req.body.branchName + "' and vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

//dashboard vender counts

adminShopController.viewonboardedvendercount = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=0 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.viewapprovedvendercount = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=1 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.viewblockedvendercount = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=3  and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.viewdeclinedvendercount = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=2 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


//dashboadrd by branch


adminShopController.viewonboardedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops INNER JOIN branch ON branch.id = shops.branchId where shops.created_at between '" + req.body.startdate + "' and branch.id='" + req.body.branchId + "' and '" + req.body.enddate + "' and shops.Isdelete='0' and branch.Isdelete='0' and shops.status=0 and shops.vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.viewapprovedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops INNER JOIN branch ON branch.id = shops.branchId where shops.created_at between '" + req.body.startdate + "' and branch.id='" + req.body.branchId + "' and '" + req.body.enddate + "' and shops.Isdelete='0' and branch.Isdelete='0' and shops.status=1 and shops.vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.viewblockedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops INNER JOIN branch ON branch.id = shops.branchId where shops.created_at between '" + req.body.startdate + "' and branch.id='" + req.body.branchId + "' and '" + req.body.enddate + "' and shops.Isdelete='0' and branch.Isdelete='0' and shops.status=3 and shops.vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.viewdeclinedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops INNER JOIN branch ON branch.id = shops.branchId where shops.created_at between '" + req.body.startdate + "' and branch.id='" + req.body.branchId + "' and '" + req.body.enddate + "' and shops.Isdelete='0' and branch.Isdelete='0' and shops.status=2 and shops.vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}




//

//stopped


adminShopController.viewonboardedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=0 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.viewapprovedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=1 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.viewblockedapprovedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=3 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.viewdeclinedvendercountbybranch = function (req, res) {

    db.query("select count(*) as venderregistredcount from shops    where created_at between '" + req.body.startdate + "' and '" + req.body.enddate + "' and IsDelete='0'  and status=2 and vendorid='" + req.body.vendorid + "';", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

//

adminShopController.ListOfApprovedVendor = function (req, res) {

    db.query("select shops.id,branch.name as branchname,branch.id as branchId,shops.percentage,shops.name,shops.mobile,shops.lat,shops.lng,shops.description,shops.gstNo,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.status='1' and branch.IsDelete='0' and branch.id='" + req.body.branchName + "' and shops.vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.ListOfBlockedVendor = function (req, res) {

    db.query("select shops.id,shops.percentage,branch.name as branchname,branch.id as branchId,shops.name,shops.mobile,shops.lat,shops.lng,shops.description,shops.gstNo,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.status='3' and branch.IsDelete='0' and branch.id='" + req.body.branchName + "' and shops.vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.registrationUpdate = function (req, res) {
    db.query("update shops SET branchId='" + req.body.branchName + "',name='" + req.body.shopName + "',mobile='" + req.body.mobile + "',lat='" + req.body.let + "',lng='" + req.body.lng + "',description='" + req.body.description + "',gstNo='" + req.body.gstNo + "',tinNo='" + req.body.pinNo + "',panNo='" + req.body.panNo + "',aadhaar='" + req.body.aadhaar + "',address='" + req.body.address + "',pin='" + req.body.pin + "',country='" + req.body.country + "',state='" + req.body.state + "',city='" + req.body.city + "',updated_by='vender' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully updated !', result, res);
    });
}
// 1 approve  , 2 block , 0 unappoved
adminShopController.registrationVendorApprove = function (req, res) {
    db.query("update shops SET status='1' where  id='" + req.body.Id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully approved !', result, res);
    });
}

adminShopController.registrationVendorBlock = function (req, res) {
    db.query("update shops SET status='2' where id='" + req.body.Id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vendor Successfully blocked !', result, res);
    });
}

adminShopController.registrationUpdateStatus = function (req, res) {
    db.query("update shops SET  percentage='" + req.body.percentage + "', comment='" + req.body.comment + "' , status='" + req.body.status + "',updated_by='" + req.body.updated_by + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender updated Successfully  !', result, res);
    });
}

adminShopController.registrationIsDelete = function (req, res) {
    db.query("update shops SET IsDelete='1',updated_by='" + req.body.updated_by + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Deleted Successfully  !', result, res);
    });
}

adminShopController.deletevendors = function (req, res) {
    db.query("DELETE FROM shops WHERE id='" + req.body.id + "'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Vender Successfully Deleted!', result, res);
    });

}



adminShopController.ListOfUnApprovedShops = function (req, res) {

    db.query("select shops.id,branch.name as branchname,branch.id as branchId,shops.name,shops.mobile,shops.percentage, shops.lat,shops.lng,shops.description,shops.gstNo,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.IsDelete='0' and branch.IsDelete='0' and branch.id='" + req.body.branchName + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}
adminShopController.ListOfApprovedShops = function (req, res) {

    db.query("select shops.id,branch.name as branchname,branch.id as branchId,shops.percentage,shops.name,shops.mobile,shops.lat,shops.lng,shops.description,shops.gstNo,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.status='1' and branch.IsDelete='0' and branch.id='" + req.body.branchName + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}

adminShopController.ListOfBlockedShops = function (req, res) {

    db.query("select shops.id,shops.percentage,branch.name as branchname,branch.id as branchId,shops.name,shops.mobile,shops.lat,shops.lng,shops.description,shops.gstNo,shops.tinNo,shops.panNo,shops.aadhaar,shops.address,shops.pin,shops.file,shops.country,shops.state,shops.city,shops.status,shops.comment from  shops    inner join branch on shops.branchId=branch.id    where  shops.status='3' and branch.IsDelete='0' and branch.id='" + req.body.branchName + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Vender Successfully fetched !', result, res);
    });
}


adminShopController.UploadImage = function (req, res) {
    db.query("update shops SET file='" + req.file.filename + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'File Upload Success Successfully updated !', result, res);
    });
}

// view Shop

adminShopController.viewShopByVendor = function (req, res) {
    db.query("select  id,name from shops   where  vendorId='" + req.body.vendorid + "' and Isdelete='0'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Shop Data Successfully Fatch !', result, res);
    });
}

// Shop

adminShopController.storeshop = function (req, res) {
    db.query("insert into shops(branchId,shopId,name,mobile,lat,lng,description,gstNo,tinNo,panNo,aadhaar,address,pin,country,state,city,created_by,vendorId,percentage,comment,review,file,IsDelete,status)values('" + req.body.branchName + "','"+ req.body.shopId + "','"  + req.body.shopName + "','" + req.body.mobile + "','" + req.body.let + "','" + req.body.lng + "','" + req.body.description + "','" + req.body.gstNo + "','" + req.body.tinNo + "','" + req.body.panNo + "','" + req.body.aadhaar + "','" + req.body.address + "','" + req.body.pin + "','" + req.body.country + "','" + req.body.state + "','" + req.body.city + "','" + req.body.created_by + "','" + req.body.vendorId+ "','" + req.body.percentage+ "','" + req.body.comment +"','" + req.body.review+"','" + req.body.file + "','0','0')", (err, result, fields) => {

        if (err) throw err;
        const shpID='SHOP-'+result.insertId;
         db.query("update shops SET shopId='"+shpID+"' where id='"+result.insertId+"'", (err, result, fields) =>{
         if (err) throw err;
            config.response(200, 'Shop Successfully Inserted !', result, res);
         });
    });
}

adminShopController.shopUpdate = function (req, res) {
    db.query("update shops SET percentage='" + req.body.percentage + "', comment='" + req.body.comment + "' ,vendorId='" + req.body.vendorId + "' ,review='" + req.body.review + "' ,branchId='" + req.body.branchName + "',name='" + req.body.shopName + "',mobile='" + req.body.mobile + "',lat='" + req.body.let + "',lng='" + req.body.lng + "',description='" + req.body.description + "',gstNo='" + req.body.gstNo + "',tinNo='" + req.body.tinNo + "',panNo='" + req.body.panNo + "',aadhaar='" + req.body.aadhaar + "',address='" + req.body.address + "',pin='" + req.body.pin + "',country='" + req.body.country + "',state='" + req.body.state + "',city='" + req.body.city +"',file='" + req.body.file + "',updated_by='vender' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Shop Successfully updated !', result, res);
    });
}

adminShopController.updateshopisdelete = function (req, res) {
    db.query("update shops SET IsDelete='1',updated_by='" + req.body.updated_by + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Shop Deleted Successfully  !', result, res);
    });
}

adminShopController.viewshop = function (req, res) {

    db.query("select id,branchId,name,mobile,comment,lat,lng,description,percentage,gstNo,tinNo,panNo,aadhaar,address,pin,file,country,state,city,review,vendorId,shopId,status from  shops where  IsDelete='0' and vendorid='" + req.body.vendorid + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Shop Successfully fetched !', result, res);
    });
}

adminShopController.approvedeclainshop = async function (req, res) 
{
    db.query("update shops SET status ='"+req.body.status+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Shop Successfully updated !', result, res);
    });
   
}

module.exports = adminShopController;