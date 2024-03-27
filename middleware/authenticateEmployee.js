const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./../config/config');
const db =require("../db/connection");
const authenticateToken = (req, res, next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) config.response(403,'Token Not Found!',{},res);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return config.response(403,'Invalid Token!',{},res);
        db.query("select * from  employee where mobile='"+user?._id+"'", (err, result, fields) =>{
            if (err) throw err;
            if(result.length>0)
            {
                req.userId = result[0].id
                req.token = token
                next();
            }
            else
            {
                return config.response(500, 'unauthorized user !', {}, res);
            }
            
        });
        
    })  
}

module.exports = authenticateToken;