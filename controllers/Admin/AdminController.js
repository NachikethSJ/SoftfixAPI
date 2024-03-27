const adminController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


adminController.userVerification= function (req, res)
{
    adminController.generateAccessToken(req, res)
}

adminController.generateAccessToken = function (req, res) {
    var mobile=req.body.mobile
   console.log(mobile);
    db.query("select * from adminlogin where cpassword='"+req.body.password+"' and  phoneno='"+req.body.mobile+"' ", (err, result, fields) =>{
        if (err) throw err;
        console.log(result[0])
        if(result.length)
        {
            try  
            {
                let registrations=result[0];
                const  token= jwt.sign({_id:mobile}, process.env.TOKEN_SECRET);
                console.log("k"+token);
                db.query("update adminlogin SET token='"+token+"' where cpassword='"+req.body.password+"' and phoneno='"+req.body.mobile+"'", (err, result, fields) =>{
                    if (err) throw err;
                    config.response(200,'Token',{token,registrations},res);
                });
            } 
            catch (error) 
            {
                config.response(500,'`Token error`',{},res);
            }
        }
        else
        {
            config.response(500,'user is not register ',result,res);
        }
           
      
    });  
 }

adminController.viewadmin= function (req, res) 
{
     db.query("select id,name,roleId,phoneno,brnachid,country,state,city,pin  from  adminlogin where   Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}

adminController.viewadminforlogin= async function (req, res) 
{
     db.query("select id,name,roleId,phoneno,branchid,country,state,city,pin  from  adminlogin where   phoneno='"+req.body.phone+"' and cpassword='"+req.body.password+"' and  Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Fetched Successfully  !', result, res);
    });
}


// employController.viewempolydropdown = function (req, res) 
// {
//      db.query("select id,employName  from  employee where mode='"+req.body.mode+"' and registerid='"+req.body.registerId+"' and Isdelete='0' and status='1' ", (err, result, fields) =>{
//         if (err) throw err;
//         config.response(200, 'Employee Fetched Successfully  !', result, res);
//     });
// }
adminController.storeadmin = async function (req, res) 
{
    const lastid=0;
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("insert into adminlogin(name,password,cpassword,roleId,phoneno,branchid,country,state,city,pin,created_at,created_by,IsDelete)values('"+req.body.name+"','"+encpass+"','"+req.body.cpassword+"','"+req.body.roleId+"','"+req.body.phoneno+"','"+req.body.branchid+"','"+req.body.country+"','"+req.body.state+"','"+req.body.city+"','"+req.body.pin+"','"+datetime+"','"+req.body.created_by+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
}

adminController.updateadmins = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const encpass=await config.hashPassword(req.body.password, res);
    db.query("update adminlogin SET  cpassword='"+req.body.password+"',password='"+encpass+"' , phoneno='"+req.body.phone+"',country='"+req.body.country+"',state='"+req.body.city+"',state='"+req.body.city+"',state='"+req.body.state+"',update_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully updated !', result, res);
    });
   
}
adminController.updateadminloginisdelete = async function (req, res) 
{
    db.query("update adminlogin SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Employee Successfully deleted !', result, res);
    });
   
}
//test

adminController.getAdmins = async (req, res) => { 
  try {
    let whereCondition = '';
    let orderCondition = 'ORDER BY created_at DESC'; // Default sorting by createdDate

    // Handle search
    if (req.query.search) {
      whereCondition = `WHERE name LIKE '%${req.query.search}%' OR branchid LIKE '%${req.query.search}%' OR country LIKE '%${req.query.search}%' OR state LIKE '%${req.query.search}%' OR city LIKE '%${req.query.search}%' OR pin LIKE '%${req.query.search}%' OR phoneno LIKE '%${req.query.search}%'`;
    }

    // Handle sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(':');
      orderCondition = `ORDER BY ${sortBy[0]} ${sortBy[1] === 'desc' ? 'DESC' : 'ASC'}`;
    }

    const queryStr = `SELECT id,name,roleId,phoneno,branchid,country,state,city,pin,created_at,created_by,updated_at,update_by FROM adminlogin ${whereCondition} ${orderCondition}`;

    // Execute the query
    db.query(queryStr, (err, result, fields) =>{
      if (err) throw err;
      console.log(result)
      res.status(200).json({ success: true, data: result });
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

adminController.updateAdmin = async (req, res) => { 
  try {
    const adminId = req.body.id; // Assuming the role ID is part of the route parameter
    const { name, phoneno, state, city, pin,country,branchid, roleId  } = req.body;

    // Validate if required parameters are present
    if (!name || !country || !state || !city || !pin || !phoneno || !branchid || !roleId) {
      return res.status(400).json({ success: false, error: 'Incomplete data. Please provide all required fields.' });
    }

     db.query("update adminlogin SET name='"+name+"',phoneno='"+phoneno+"',roleId='"+roleId+
     "',country='"+country+"',state='"+state+"',city='"+city+"',pin='"+pin+"',branchid='"+branchid+"' where id='"+adminId+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Admin updated successfully !', result, res);
    });

    // const updateQuery = `
    //   UPDATE adminlogin
    //   SET name = ?, country = ?, state = ?, city = ?, pin = ?, phoneno = ?
    //   WHERE id = ?`;

    // // Execute the update query
    // await db.query(updateQuery, [name, country, state, city, pin, phoneno, adminId]);

    // res.status(200).json({ success: true, message: 'Admin updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

adminController.deleteAdmin = async (req, res) => { 
  try {
    const adminId = req.params.id; // Assuming the role ID is part of the route parameter

    // Validate if the admin id is provided
    if (!adminId) {
      return res.status(400).json({ success: false, error: 'admin ID is required.' });
    }

    const deleteQuery = 'DELETE FROM adminlogin WHERE id = ?';

    // Execute the delete query
    await db.query(deleteQuery, [adminId]);

    res.status(200).json({ success: true, message: 'admin deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


// employController.deleteemployee = function (req, res) 
// {
//     db.query("DELETE FROM employee WHERE id='"+req.body.id+"'", function (err, result, fields) {
//         if (err) throw err;
//         config.response(200, 'Employee Successfully Deleted!', result, res);
//     });
    
// }
// employController.baranchNameList = function (req, res) 
// {
//      db.query("select id,branchName from  vendors", (err, result, fields) =>{
//         if (err) throw err;
//         config.response(200, 'Branch Name Fetched Successfully !', result, res);
//     });
// }


adminController.viewtotalbooking= function (req, res) 
{
     db.query("select count(*) as noofbooking from booking where created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"' and IsDelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}

adminController.viewtotalbookingbybranch= function (req, res) 
{
     db.query("select count(*) as noofbooking from booking inner join booking_details on booking_details.bookingId= booking.id inner join sub_services on booking_details.serviceTypeId= sub_services.id inner join service on service.id=sub_services.serviceId inner join vendors on vendors.id=service.shopId INNER JOIN branch ON branch.id = vendors.branchId where booking.created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and branch.id= '"+req.body.branchId+"' and vendors.Isdelete='0' and branch.Isdelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}

adminController.viewtotalbookingbyvender= function (req, res) 
{
     db.query("select count(*) as noofbooking from booking inner join booking_details on booking_details.bookingId= booking.id inner join sub_services on booking_details.serviceTypeId= sub_services.id inner join service on service.id=sub_services.serviceId inner join vendors on vendors.id=service.shopId INNER JOIN branch ON branch.id = vendors.branchId where booking.created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and vendors.id= '"+req.body.registrationId+"' and vendors.Isdelete='0' and sub_services.Isdelete='0' and service.Isdelete='0' and branch.Isdelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}

adminController.viewviewtotalamountcollectedByBranch= function (req, res) 
{
     db.query("select sum(amountcollected) as amount from paymentforbooking  inner join sub_services on  paymentforbooking.serviceTypeId= sub_services.id     inner join service on service.id=sub_services.serviceId  INNER JOIN vendors ON vendors.id = paymentforbooking.venderId  INNER JOIN branch ON branch.id = vendors.branchId where  paymentforbooking.created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"' paymentforbooking.IsDelete='0' and branch.id='"+req.body.branchId+"'  and branch.Isdelete='0'  and vendors.Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}

adminController.viewviewtotalamountcollectedByVender= function (req, res) 
{
     db.query("select sum(amountcollected) as amount from paymentforbooking  inner join sub_services on  paymentforbooking.serviceTypeId= sub_services.id     inner join service on service.id=sub_services.serviceId  INNER JOIN vendors ON vendors.id = paymentforbooking.venderId  INNER JOIN branch ON branch.id = vendors.branchId where  paymentforbooking.created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"' paymentforbooking.IsDelete='0' and vendors.id='"+req.body.registrationId+"'  and branch.Isdelete='0'  and vendors.Isdelete='0'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}


adminController.viewviewtotalamountcollected= function (req, res) 
{
     db.query("select sum(amountcollected) as amount from paymentforbooking where  created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"' and IsDelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}


adminController.viewviewtotalamountcompanyshare= function (req, res) 
{
     db.query("select sum(companyshare) as companyshare from paymentforbooking where  created_at between '"+req.body.startdate+"'  and '"+req.body.enddate+"' and IsDelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}



adminController.viewviewtotalamountcompanyshareBybranch= function (req, res) 
{
     db.query("select sum(companyshare) as amount from paymentforbooking inner join sub_services on paymentforbooking.serviceTypeId= sub_services.id inner join service on service.id=sub_services.serviceId INNER JOIN vendors ON vendors.id = paymentforbooking.venderId INNER JOIN branch ON branch.id = vendors.branchId INNER JOIN city ON branch.cityId = city.id INNER JOIN state ON city.stateId = state.id INNER JOIN country ON state.countryId = country.id where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and paymentforbooking.IsDelete='0' and branch.id='"+req.body.branchId+"' and vendors.Isdelete='0' and branch.Isdelete='0' and city.Isdelete='0' and state.Isdelete='0' and country.Isdelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}



adminController.viewviewtotalamountcompanyshareByvender= function (req, res) 
{
     db.query("select sum(companyshare) as amount from paymentforbooking inner join sub_services on paymentforbooking.serviceTypeId= sub_services.id inner join service on service.id=sub_services.serviceId INNER JOIN vendors ON vendors.id = paymentforbooking.venderId INNER JOIN branch ON branch.id = vendors.branchId INNER JOIN city ON branch.cityId = city.id INNER JOIN state ON city.stateId = state.id INNER JOIN country ON state.countryId = country.id where created_at between '"+req.body.startdate+"' and '"+req.body.enddate+"' and paymentforbooking.IsDelete='0' and vendors.id='"+req.body.registrationId+"' and vendors.Isdelete='0' and branch.Isdelete='0' and city.Isdelete='0' and state.Isdelete='0' and country.Isdelete='0';", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Booking  Fetched Successfully  !', result, res);
    });
}



module.exports = adminController;