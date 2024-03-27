const countryController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const dotenv = require('dotenv');


// countryController.viewcountrypage = function (req, res) {
//     // Extract pagination parameters
//     const page = req.query.page ? parseInt(req.query.page) : 1;
//     const limit = req.query.limit ? parseInt(req.query.limit) : 10;
//     const offset = (page - 1) * limit;

//     // Extract sorting parameters
//     const sortBy = req.query.sortBy ? req.query.sortBy : 'id'; // Default sort by id
//     const sortOrder = req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
//     const searchTerm = req.query.searchTerm;

//     // Construct the SQL query to fetch paginated data
//     const dataQuery = `
//         SELECT id, name 
//         FROM country 
//         WHERE Isdelete = '0' and name like '%${searchTerm}%'
//         ORDER BY ${sortBy} ${sortOrder}
//         LIMIT ${limit}
//         OFFSET ${offset}
//     `;

//     // Execute the data query
//     db.query(dataQuery, (err, dataResult, fields) => {
//         if (err) throw err;

//         // Construct the SQL query to count total records
//         const countQuery = `
//             SELECT COUNT(*) AS total 
//             FROM country 
//             WHERE Isdelete = '0' and name like '%${searchTerm}%'
//         `;

//         // Execute the count query
//         db.query(countQuery, (countErr, countResult, countFields) => {
//             if (countErr) throw countErr;

//             const totalCount = countResult[0].total;

//             const responsePayload = {
//                 total: totalCount,
//                 page: page,
//                 pageSize: limit,
//                 data: dataResult
//             };

//             config.response(200, 'Country Fetched Successfully!', responsePayload, res);
//         });
//     });
// };

countryController.viewcountrypage = function (req, res) {
    // Extract pagination parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = (page - 1) * limit;

    // Extract sorting parameters
    const sortBy = req.query.sortBy ? req.query.sortBy : 'id'; // Default sort by id
    const sortOrder = req.query.sortOrder && req.query.sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const searchTerm = req.query.searchTerm;

    // Construct the SQL query to fetch paginated data
    const dataQuery = `
        SELECT id, name 
        FROM country 
        WHERE Isdelete = '0' and name like '%${searchTerm}%'
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${limit}
        OFFSET ${offset}
    `;

    // Execute the data query
    db.query(dataQuery, (err, dataResult, fields) => {
        if (err) throw err;

        // Construct the SQL query to count total records
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM country 
            WHERE Isdelete = '0' and name like '%${searchTerm}%'
        `;

        // Execute the count query
        db.query(countQuery, (countErr, countResult, countFields) => {
            if (countErr) throw countErr;

            const totalCount = countResult[0].total;

            const responsePayload = {
                total: totalCount,
                page: page,
                pageSize: limit,
                data: dataResult
            };

            config.response(200, 'Country Fetched Successfully!', responsePayload, res);
        });
    });
};


countryController.viewcountry= function (req, res) 
{
     db.query("select id,name from  country where   Isdelete='0'  ", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Country Fetched Successfully  !', result, res);
    });
}
countryController.storecountry =async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("insert into country(name,created_by,created_at,IsDelete)values('"+req.body.name+"','"+req.body.created_by+"','"+datetime+"','0')", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Country Successfully added !', result, res);

    });
}
countryController.updatecountry = async function (req, res) 
{
    var datetime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query("update country SET  name='"+req.body.name+"',updated_by='"+req.body.updated_by+"', updated_at='"+datetime+"'  where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Country Successfully updated !', result, res);
    });
   
}
countryController.updatecountryisdelete = async function (req, res) 
{
    db.query("update country SET IsDelete='"+1+"',updated_by='"+req.body.updated_by+"' where id='"+req.body.id+"'", (err, result, fields) =>{
        if (err) throw err;
        config.response(200, 'Country Successfully deleted !', result, res);
    });
   
}

module.exports = countryController;