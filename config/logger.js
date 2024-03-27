const  winston = require("winston");
// import { APP_ENV } from "./config.js";


const logger = winston.createLogger({
    level: "error",
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports:[
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ],
});
 

const errorLog = (error)=>{
    // if(APP_ENV=="production"){
        logger.error(error)
        console.log(error);
    // }else{
    //     console.error(error);
    // }
}

module.exports = errorLog;
