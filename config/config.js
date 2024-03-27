const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require("../db/connection");
const commonServices = require('../servicves/commonServices');
const errorLog = require('./logger');
const AWS = require("aws-sdk");
const axios = require('axios');

dotenv.config();
const config = {};
config.hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt)
    return hashedPassword
}
config.response = (rescode, message, data, res) => {
    data = (JSON.stringify(data) === '{}') ? {} : data;
    const status = rescode == 200 ? true : false;
    res.status(rescode).json({ result: data.length, data: data, message: message, status: status });
    return false;
}

config.validatePan = (panno, res) => {
    var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!regex.test(panno)) {
        config.response(500, 'Invalid Pan NO!', {}, res);
        return false;
    }

}
config.validateMobile = (mobile, res) => {
    var expr = /^(0|91)?[6-9][0-9]{9}$/;
    if (!expr.test(mobile)) {
        config.response(500, 'Invalid Mobile NO!', {}, res);
        return false;
    }

}
config.validateGst = (gstno, res) => {
    var expr = new RegExp('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]1}[1-9A-Z]{1}Z[0-9A-Z]{1}$');
    if (expr.test(gstno)) {
        config.response(500, 'Invalid Gst No !', {}, res);
        return false;
    }
}
config.validateAdhaar = (aadhaar, res) => {
    var expr = /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/;
    if (!expr.test(aadhaar)) {
        config.response(500, 'Invalid Gst No !', {}, res);
        return false;
    }

}

// Create token

// Generating JWT autentication token
config.generateAccessToken = function (req, res) {
    var mobile = req.body.mobile
    db.query("select * from registrations where mobile='" + mobile + "'", (err, result, fields) => {
        if (err) throw err;
        if (result.length) {
            try {
                let registrations = result[0];
                const token = jwt.sign({ _id: mobile }, process.env.TOKEN_SECRET);
                db.query("update registrations SET token='" + token + "' where mobile='" + mobile + "'", (err, result, fields) => {
                    if (err) throw err;
                    config.response(200, 'Token', { token, registrations }, res);
                });
            }
            catch (error) {
                config.response(500, '`Token error`', {}, res);
            }
        }
        else {
            config.response(500, 'Vender is not register ', result, res);
        }


    });
}
config.getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = config.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = config.deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(config.deg2rad(lat1)) *
        Math.cos(config.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
}

config.deg2rad = function (deg) {
    return deg * (Math.PI / 180);
}
config.UploadImage = async (req, res, images) => {
    try {
        let imageName = [];
        for (let image of req?.files) {
            let fileName = 'image-' + (Date.now()) + '.' + (image?.mimetype?.split("/")[1]);
            let filePath = config.getUploadedPath(req?.body?.type);
            let fileData = image?.buffer;
            await config.uploadToS3(fileName, filePath, fileData);
            imageName.push({ fileName, filePath });
        }
        imageName = JSON.stringify(imageName);
        const result = await commonServices.create('images', { imageName });
        return config.response(200, 'File Upload Successfully !', result, res);
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', {}, res);
    }
}

const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_BUCKET_REGION
});

config.uploadToS3 = (fileName, filePath, fileData) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: filePath + '/' + fileName,
            Body: fileData,
        };
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            return resolve(data);
        });
    });
};

config.getImageSingedUrlById = async (uploadId) => {
    let uploadData = await commonServices.getById('images', uploadId);
    // console.log(uploadData);
    if (uploadData) {
        let images = JSON.parse(uploadData?.imageName);
        let imageUrls = [];
        for (let image of images) {
            imageUrls.push(await config.getSignUrl(image?.filePath + '/' + image?.fileName));
        }
        return imageUrls;
    } else {
        return null
    }
}

config.getSignUrl = async (fileKey) => {
    let url = await S3.getSignedUrlPromise('getObject', {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Expires: Number(process.env.AWS_S3_EXPIRES_SINGNED_URL),
    });
    return url;
}
config.getUploadedPath = (type) => {
    return 'charrySaloon/uploads/' + type?.toLowerCase();
}

config.sendMobileOtp = (mobile, otp) => {
    axios.get(`http://sms.softfix.in/submitsms.jsp?user=EsafeS&key=d5a7374c54XX&mobile=${mobile}&message=Dear%20User,%20Your%20OTP%20for%20login%20to%20Jio%20TrueConnect%20portal%20is%20Your%20Salon%20OTP%20is%20${otp}%20.%20Valid%20for%2030%20minutes.%20Please%20do%20not%20share%20this%20OTP.%20Regards,%20Jio%20Trueconnect%20Team&senderid=DEALDA&accusage=1&entityid=1201159965850654415&tempid=1207167722926890489`).then((response) => {
        return true;
    }).catch((error) => {
        throw new Error(error);
    });
}

config.createShopId = async () => {
    let latestData = await commonServices.getLatestData('shops');
    let shopId = 'SHOP1001';
    if (latestData) {
        shopId = 'SHOP' + (Number(latestData?.shopId?.slice(4)) + 1);
    }
    return shopId;
}

config.createEmployeeId = async () => {
    let latestData = await commonServices.getLatestData('employee');
    let EmpId = 'EMP1001';
    if (latestData) {
        EmpId = 'EMP' + (Number(latestData?.employId?.slice(3)) + 1);
    }
    return EmpId;
}

config.isCurrentTimeInRange = async (date, startTiming1, endTiming1, startTiming2, endTiming2) => {
    // Set the timezone to Indian Standard Time (IST)
    const timeZone = 'Asia/Kolkata';

    // Create a new Date object with the current time in the specified timezone
    const currentTime = new Date(date).toLocaleString('en-US', { timeZone });

    // Create start and end time objects
    const startTime1 = new Date(currentTime);
    const endTime1 = new Date(currentTime);
    // Create start and end time objects
    const startTime2 = new Date(currentTime);
    const endTime2 = new Date(currentTime);

    // Set start time in 24-hour format
    startTime1.setHours(startTiming1?.getHours(), startTiming1?.getMinutes(), 0, 0);

    // Set end time in 24-hour format
    endTime1.setHours(endTiming1?.getHours(), endTiming1?.getMinutes(), 0, 0);

    // Set start time in 24-hour format
    startTime2.setHours(startTiming2?.getHours(), startTiming2?.getMinutes(), 0, 0);

    // Set end time in 24-hour format
    endTime2.setHours(endTiming2?.getHours(), endTiming2?.getMinutes(), 0, 0);
    return ((startTiming1 < endTiming2 && endTiming1 > startTiming2) || (startTiming2 < endTiming1 && endTiming2 > startTiming1));
}
module.exports = config;