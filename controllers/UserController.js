const userController = {};
const db = require("../db/connection");
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
userController.offerpackageList = function (req, res) {
    const offerpackquery = "SELECT package.* ,select * ,(3959 *acos(cos(radians(37)) * cos(radians('registrations.lat')) * cos(radians(registrations.lng) - radians(-122)) + sin(radians(37)) * sin(radians(registrations.lat )))) AS distance FROM packages INNER JOIN registrations ON user.id=package.userId";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
}
userController.membershipList = function (req, res) {
    const offerpackquery = "SELECT memberships.*, servicetype.type as s_type,servicetype.price as s_price,servicetype.timeTaken as s_timeTaken,servicetype.timeTaken as s_timeTaken,servicetype.details as s_details,servicetype.termAndcondition as s_termAndcondition,service.*,registrations.* FROM memberships INNER JOIN servicetype ON servicetype.id=memberships.serviceTypeId INNER JOIN service ON service.id = servicetype.serviceId INNER JOIN registrations ON registrations.id = service.shopId ORDER BY memberships.offer DESC;";

    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });

}
userController.storeReview = function (req, res) {

    db.query("insert into reviews(rate,comment,serviceId,created_by)values('" + req.body.rate + "','" + req.body.comment + "','" + req.body.serviceId + "','" + req.user + "')", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Review send Successfully !', result, res);
    });
}
//Fatch package
userController.viewSupportUsers = function (req, res) {
    db.query("select id,name,message,status,created_at from  supportsforuser where created_by='" + req.body.created_by + "' and Isdelete='0' order by created_at desc", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Supports Data Successfully Fatch !', result, res);
    });

}
///  Store support  
userController.storeSupportUsers = async function (req, res) {
    db.query("insert into supportsforuser(name,message,created_by,IsDelete)values('" + req.body.name + "','" + req.body.message + "','" + req.body.userId + "','0')", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Support Successfully Inserted !', result, res);
    });
}
userController.viewShop = function (req, res) {
    const offerpackquery = "SELECT registrations.id as id,registrations.shopName as shopName,registrations.let as let,registrations.lng as lng, images.imageName as images,registrations.description as description,registrations.review FROM registrations INNER JOIN images ON images.id = registrations.file where registrations.Isdelete='0' order by review ";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        const alldata = [];
        for (j = 0; j < result.length; j++) {
            var distance = config.getDistanceFromLatLonInKm(req.body.let, req.body.lng, result[j].let, result[j].lng);
            const timeInSeconds = 3600;
            const distanceInMetres = distance * 1000;
            var pace = (timeInSeconds / distanceInMetres) / 60 * 1000;
            var leftover = pace % 1;
            var minutes = pace - leftover;
            var seconds = Math.round(leftover * 60);
            image = result[j].images;
            imageData = JSON.parse(image);
            console.log(imageData)
            if (imageData.length > 0) {
                dataimages = imageData[0].filename;
            }
            else {
                dataimages = [];
            }

            const alldatas =
            {
                id: result[j].id,
                shopName: result[j].shopName,
                let: result[j].let,
                lng: result[j].lng,
                description: result[j].description,
                review: result[j].review,
            }
            var time = minutes + ":" + seconds;
            if (distance < 50) {
                alldata.push({ ...alldatas, distance, time, dataimages });
            }

            //alldata.push({...result[j],distance,time});
        }
        config.response(200, 'Service Data Successfully Fatch !', alldata, res);
    });
}
userController.viewUserPackage = function (req, res) {

    const offerpackquery = "SELECT registrations.id as id,registrations.shopName as shopName,registrations.let as let,registrations.lng as lng, images.imageName as images,registrations.description as description,packages.offer as offer,packages.price as price,packages.startDate as startDate,packages.packageName as packageName,packages.endDate as endDate,AVG(reviews.rate) AS avg_rating FROM registrations INNER JOIN packages ON packages.userId = registrations.id INNER JOIN reviews ON reviews.serviceId=packages.serviceTypeId INNER JOIN images ON images.id = registrations.file ";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        const alldata = [];
        for (j = 0; j < result.length; j++) {

            if (result[j].id != null) {
                var distance = config.getDistanceFromLatLonInKm(req.body.let, req.body.lng, result[j].let, result[j].lng);
                const timeInSeconds = 3600;
                const distanceInMetres = distance * 1000;
                var pace = (timeInSeconds / distanceInMetres) / 60 * 1000;
                var leftover = pace % 1;
                var minutes = pace - leftover;
                var seconds = Math.round(leftover * 60);
                var time = minutes + ":" + seconds;
                alldata.push({ ...result[j], distance, time });
            }
        }
        config.response(200, 'Package Data Successfully Fatch !', alldata, res);
    });
}

userController.viewUserMembership = function (req, res) {
    const offerpackquery = "SELECT registrations.id as id,registrations.shopName as shopName,registrations.let as let,registrations.lng as lng, images.imageName as images,registrations.description as description,memberships.offer as offer,memberships.price as price,memberships.membershipName as membershipName,memberships.startDate as startDate,memberships.endDate as endDate,AVG(reviews.rate) AS avg_rating FROM registrations INNER JOIN memberships ON memberships.userId = registrations.id  INNER JOIN reviews ON reviews.serviceId=memberships.serviceTypeId INNER JOIN images ON images.id = registrations.file ";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        const alldata = [];
        for (j = 0; j < result.length; j++) {

            if (result[j].id != null) {
                var distance = config.getDistanceFromLatLonInKm(req.body.let, req.body.lng, result[j].let, result[j].lng);
                const timeInSeconds = 3600;
                const distanceInMetres = distance * 1000;
                var pace = (timeInSeconds / distanceInMetres) / 60 * 1000;
                var leftover = pace % 1;
                var minutes = pace - leftover;
                var seconds = Math.round(leftover * 60);
                var time = minutes + ":" + seconds;
                alldata.push({ ...result[j], distance, time });
            }
        }
        config.response(200, 'Membership Data Successfully Fatch !', alldata, res);
    });

}

userController.viewUserService = function (req, res) {
    const offerpackquery = "SELECT service.id as id,service.serviceName as serviceName,servicetype.type as s_name,servicetype.price as price, servicetype.timeTaken as timeTaken,servicetype.offer as offer,images.imageName as images,AVG(reviews.rate) AS avg_rating FROM service INNER JOIN registrations ON registrations.id=service.shopId INNER JOIN servicetype ON servicetype.serviceId=service.id INNER JOIN reviews ON reviews.serviceId=registrations.id INNER JOIN images ON images.id = servicetype.file";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;

        config.response(200, 'Service Data Successfully Fatch !', result, res);
    });

}

userController.viewUserServiceForShop = function (req, res) {
    const offerpackquery = "SELECT servicetype.id as id,service.serviceName as serviceName,servicetype.type as servicetype,servicetype.price as price,servicetype.offer as offer,images.imageName as images,servicetype.details,servicetype.rating AS rating FROM service INNER JOIN servicetype ON servicetype.serviceId=service.id Left JOIN images ON images.id = servicetype.file where service.id='" + req.body.shopId + "' and service.mode='" + req.body.mode + "' and servicetype.IsDelete=0";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        //imageData=JSON.parse(image);
        dataimages = result.map((dataimg) => {
            imagedata = dataimg.images ? JSON.parse(dataimg.images) : [];
            if (imagedata == 0 || imagedata == null) {
                imagename = [];
            }
            else {
                imagename = imagedata[0].filename
            }
            return {
                id: dataimg.id,
                serviceName: dataimg.serviceName,
                servicetype: dataimg.servicetype,
                price: dataimg.price,
                offer: dataimg.offer,
                images: imagename,
                details: dataimg.details,
                rating: dataimg.rating,

            }

        })
        //datas={...result,dataimages}
        config.response(200, 'Service Data Successfully Fatch !', dataimages, res);
    });

}

userController.viewUserServiceForMainPage = function (req, res) {
    const offerpackquery = "SELECT registrations.let as let,registrations.lng as lng,service.id as id,service.serviceName as serviceName,servicetype.type as s_name,servicetype.price as price, servicetype.timeTaken as timeTaken,servicetype.offer as offer,images.imageName as images,servicetype.rating AS rating FROM service Inner JOIN registrations on  service.shopId=registrations.id INNER JOIN servicetype ON servicetype.serviceId=service.id Left JOIN images ON images.id = servicetype.file where servicetype.IsDelete=0 and service.mode='" + req.body.mode + "' order by offer desc";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        const alldata = [];
        for (j = 0; j < result.length; j++) {
            var distance = config.getDistanceFromLatLonInKm(req.body.let, req.body.lng, result[j].let, result[j].lng);
            const timeInSeconds = 3600;
            const distanceInMetres = distance * 1000;
            var pace = (timeInSeconds / distanceInMetres) / 60 * 1000;
            var leftover = pace % 1;
            var minutes = pace - leftover;
            var seconds = Math.round(leftover * 60);
            image = result[j].images ? JSON.parse(result[j].images) : [];
            imageData = image;
            let alldatapush = {
                let: result[j].let,
                lng: result[j].lng,
                id: result[j].id,
                serviceName: result[j].serviceName,
                s_name: result[j].s_name,
                price: result[j].price,
                timeTaken: result[j].timeTaken,
                offer: result[j].offer,
                rating: result[j].rating,

            }
            if (imageData.length > 0) {
                dataimages = imageData[0].filename;
            }
            else {
                dataimages = [];
            }

            var time = minutes + ":" + seconds;
            if (distance < 50) {
                alldata.push({ ...alldatapush, distance, time, dataimages });
            }

            //alldata.push({...result[j],distance,time});
        }
        config.response(200, 'Service Data Successfully Fetch !', alldata, res);
    });
}

userController.viewUserServiceTypeDetails = function (req, res) {
    const offerpackquery = "SELECT registrations.let,registrations.lng ,service.id as id,service.serviceName as serviceName, servicetype.termAndcondition,servicetype.details,    servicetype.type as s_name,servicetype.price as price, servicetype.timeTaken as timeTaken,servicetype.offer as offer,images.imageName as images,servicetype.rating AS rating  FROM service Inner JOIN registrations on  service.shopId=registrations.id INNER JOIN servicetype ON servicetype.serviceId=service.id  Left JOIN images ON images.id = servicetype.file  where servicetype.IsDelete='0' and service.mode='" + req.body.mode + "' and servicetype.id='" + req.body.id + "'";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        //imageData=JSON.parse(image);
        dataimages = result.map((dataimg) => {
            return {
                let: dataimg.let,
                lng: dataimg.lng,
                id: dataimg.id,
                serviceName: dataimg.serviceName,
                termAndcondition: dataimg.termAndcondition,
                details: dataimg.details,
                s_name: dataimg.s_name,
                price: dataimg.price,
                timeTaken: dataimg.timeTaken,
                offer: dataimg.offer,
                images: dataimg.images ? JSON.parse(dataimg.images) : [],
                rating: dataimg.rating,
            }

        })
        //datas={...result,dataimages}
        config.response(200, 'Service Details Successfully Fatch !', dataimages, res);
    });

}

userController.viewUserServiceReview = function (req, res) {
    const offerpackquery = "SELECT reviews.comment,servicetype.rating,reviews.created_at FROM servicetype Left JOIN reviews ON reviews.serviceId= servicetype.id where servicetype.id='" + req.body.id + "'";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;

        config.response(200, 'Review Data Successfully Fatch !', result, res);
    });

}

userController.wiriteReview = function (req, res) {
    const offerpackquery = "";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;

        config.response(200, 'Review Data Successfully Fatch !', result, res);
    });

}

userController.getOffer = function (req, res) {

    //config.response(200, 'Service Data Successfully Fatch !', data, res);
    const offerdata = [];
    const alldata = [];
    const offerpackquery = "SELECT packages.id as id, packages.packageName as name,packages.offer as offer,registrations.let as let,registrations.lng as lng  FROM packages INNER JOIN registrations ON registrations.id=packages.userId where packages.offer > 0 LIMIT 0, 20 ";
    const offermemberquery = "SELECT memberships.id as id, memberships.membershipName as name,memberships.offer as offer,registrations.let as let,registrations.lng as lng FROM memberships INNER JOIN registrations ON registrations.id=memberships.userId  where memberships.offer > 0 LIMIT 0, 20 ";
    const offerservicetypequery = "SELECT servicetype.id as id, servicetype.type as name,servicetype.offer as offer,registrations.let as let,registrations.lng as lng FROM servicetype INNER JOIN registrations ON registrations.id=servicetype.userId where servicetype.offer > 0 LIMIT 0, 20 ";

    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        offerdata.push(result);
        //config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
    db.query(offermemberquery, (err, result, fields) => {
        if (err) throw err;
        offerdata.push(result);
        // config.response(200, 'Service Data Successfully Fatch !', result, res);
    });
    db.query(offerservicetypequery, (err, result, fields) => {
        if (err) throw err;
        offerdata.push(result);
        for (i = 0; i < 3; i++) {
            for (j = 0; j < offerdata[i].length; j++) {
                var distance = config.getDistanceFromLatLonInKm(req.body.let, req.body.lng, offerdata[i][j].let, offerdata[i][j].lng);
                if (distance < 50) {
                    alldata.push(offerdata[i][j]);
                }

            }
        }
        config.response(200, 'Offer Data Successfully Fatch !', alldata, res);
    });
}
userController.loginUser = function (req, res) {
    db.query("select * from  user_login where mobile='" + req.body.mobile + "'", (err, result, fields) => {
        if (err) throw err;
        if (result.length == 0) {
            db.query("insert into user_login(name,mobile)values('" + req.body.name + "','" + req.body.mobile + "')", (err, result, fields) => {
                if (err) throw err;
                config.response(200, 'User Successfully Registered!', result, res);
            });
        }
        else {
            config.response(200, 'User alerady exist!', {}, res);
        }
        //config.response(200, 'User Successfully updated !', result, res);
    });
}
userController.userVerification = function (req, res) {
    userController.generateAccessToken(req, res)
}
userController.generateAccessToken = function (req, res) {
    var mobile = req.body.mobile
    db.query("select * from user_login where mobile='" + mobile + "'", (err, result, fields) => {
        if (err) throw err;
        console.log(result.length);
        if (result.length) {
            try {
                let registrations = result[0];
                const token = jwt.sign({ _id: mobile }, process.env.TOKEN_SECRET);
                db.query("update user_login SET token='" + token + "' where mobile='" + mobile + "'", (err, result, fields) => {
                    if (err) throw err;
                    config.response(200, 'Login successful', { token, registrations }, res);
                });
            }
            catch (error) {
                config.response(500, '`Token error`', {}, res);
            }
        }
        else {
            config.response(500, 'user is not register ', result, res);
        }


    });
}
userController.serviceDetails = (req, res) => {
    // const offerpackquery="SELECT packages.packageName as packageName,packages.price as price,packages.startDate as startDate,packages.endDate as endDate,packages.actualPrice as actualPrice,packages.offerPrice as offerPrice,packages.totalSaved as totalSaved,packages.timeTaken as timeTaken,packages.details as details,packages.totalSaved as totalSaved,AVG(reviews.rate) AS avg_rating FROM registrations INNER JOIN packages ON packages.userId = registrations.id INNER JOIN reviews ON reviews.serviceId=packages.serviceTypeId INNER JOIN images ON images.id = registrations.file ";
    const servicetypequery = "SELECT servicetype.details as details,servicetype.termAndcondition as termAndcondition,images.imageName as images,user_login.name as name,reviews.comment as comment,reviews.created_by as created_by FROM servicetype INNER JOIN images ON images.id = servicetype.file INNER JOIN reviews ON reviews.serviceId=servicetype.id INNER JOIN user_login ON reviews.created_by=user_login.id ";
    db.query(servicetypequery, (err, result, fields) => {
        if (err) throw err;

        config.response(200, 'Membership Data Successfully Fatch !', result, res);
    });
}
userController.membershipDetails = (req, res) => {

    const offerpackquery = "SELECT servicetype.type as serviceTypeName,service.serviceName as serviceName,servicetype.price as actualPrice,servicetype.offer as offerPrice,membership_details.noOfTime as noOfTime,images.imageName as images,servicetype.timeTaken as timeTaken,servicetype.details as details FROM memberships INNER JOIN membership_details ON memberships.id = membership_details.membershipId INNER JOIN servicetype ON membership_details.serviceTypeId=servicetype.id INNER JOIN service ON servicetype.serviceId=service.id INNER JOIN images ON images.id = servicetype.file  where memberships.id='" + req.body.membershipId + "'";
    //const 0offerpackquery="SELECT * from packages where "
    var datas;
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        // const datas=result
        const offerpackquery = "SELECT * FROM memberships where id='" + req.body.membershipId + "'";
        db.query(offerpackquery, (err, memberresult, fields) => {
            if (err) throw err;
            const startDate = memberresult[0].startDate;
            const endDate = memberresult[0].endDate;
            const termAndcondition = memberresult[0].termAndcondition;
            const details = memberresult[0].details;

            datas = { ...result, startDate, endDate, termAndcondition, details }
            config.response(200, 'Membership Data Successfully Fatch !', datas, res);
        })

    });
}

userController.packageDetails = (req, res) => {

    const offerpackquery = "SELECT servicetype.type as serviceTypeName,service.serviceName as serviceName,servicetype.price as actualPrice,servicetype.offer as offerPrice,images.imageName as images,servicetype.timeTaken as timeTaken,servicetype.details as details FROM packages INNER JOIN package_details ON packages.id = package_details.packageId INNER JOIN servicetype ON package_details.serviceTypeId=servicetype.id INNER JOIN service ON servicetype.serviceId=service.id INNER JOIN images ON images.id = servicetype.file  where packages.id='" + req.body.packageId + "'";
    //const 0offerpackquery="SELECT * from packages where "
    var datas;
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;
        // const datas=result
        const offerpackquery = "SELECT * FROM packages where packages.id='" + req.body.packageId + "'";
        db.query(offerpackquery, (err, packageresult, fields) => {
            if (err) throw err;
            const startDate = packageresult[0].startDate;
            const endDate = packageresult[0].endDate;
            const termAndcondition = packageresult[0].termAndcondition;
            const details = packageresult[0].details;

            datas = { ...result, startDate, endDate, termAndcondition, details }
            config.response(200, 'Membership Data Successfully Fatch !', datas, res);
        })

    });
}

// booking location 
userController.bookingLocation = function (req, res) {
    db.query("insert into booking_location(userId,lattitude,longitude)values('" + req.body.userId + "','" + req.body.lattitude + "','" + req.body.longitude + "')", (err, result, fields) => {
        if (err) throw err;
        console.log(result)
        config.response(200, 'Booking Location Successfully Inserted!', result, res);
    });
}
userController.bookingLocationUpdate = function (req, res) {
    console.log('abc');
    db.query("update booking_location SET lattitude='" + req.body.lattitude + "',longitude='" + req.body.longitude + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Booking Location Successfully Update', result, res);
    });
}
userController.bookingLocationDelete = function (req, res) {
    db.query("DELETE FROM booking_location WHERE id='" + req.body.id + "'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Booking Location Successfully Deleted!', result, res);
    });
}
userController.bookingLocationView = function (req, res) {
    db.query("select * from booking_location", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Booking Location Successfully Deleted!', result, res);
    });
}

// userController.addBooking = function (userId, req, res) {
//     // Get the last booking number
//     db.query(`SELECT MAX(bookingnumber) AS lastBookingNumber FROM booking`, (err, result) => {
//         if (err) {
//             console.error("Error fetching last booking number:", err);
//             return config.response(500, 'Error inserting booking', null, res);
//         }

//         // Extract the last booking number from the result
//         const lastBookingNumber = result[0].lastBookingNumber;

//         // Parse the number part and increment it
//         const lastNumber = parseInt(lastBookingNumber.replace(/[^\d]/g, ''), 10);
//         const newNumber = lastNumber + 1;

//         // Construct the new booking number
//         const newBookingNumber = 'BG' + newNumber;

//         // Extract other fields from the request body
//         const { createdBy, updatedBy, created_at, updated_at, isDelete, transactionID } = req.body;

//         // Insert into the booking table with the new booking number
//         const sql = `INSERT INTO booking(bookingnumber, created_by, updated_by, created_at, updated_at, isDelete, transactionID) 
//                      VALUES (?, ?, ?, ?, ?, ?, ?)`;

//         const values = [newBookingNumber, createdBy, updatedBy, created_at, updated_at, isDelete, transactionID];

//         db.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error("Error inserting booking:", err);
//                 return config.response(500, 'Error inserting booking', null, res);
//             }

//             // Get the last inserted bookingId
//             const bookingId = result.insertId;

//             // Now, insert into booking_details with the retrieved bookingId and other details
//             const bookingDetailsSql = `
//                 INSERT INTO booking_details(
//                     userId, employeeId, serviceTypeId, bookingDate, 
//                     bookingStartTime, bookingEndTime, promocode, tax, 
//                     latitude, longitude, bookingStatus, paymentStatus, bookingId
//                 ) 
//                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//             const bookingDetailsValues = [
//                 userId, req.body.employeeId, req.body.serviceTypeId,
//                 req.body.bookingDate, req.body.bookingStartTime, req.body.bookingEndTime,
//                 req.body.promocode, req.body.tax, req.body.latitude, req.body.longitude,
//                 req.body.bookingStatus, req.body.paymentStatus, bookingId
//             ];

//             db.query(bookingDetailsSql, bookingDetailsValues, (err, result) => {
//                 if (err) {
//                     console.error("Error inserting booking details:", err);
//                     return config.response(500, 'Error inserting booking details', null, res);
//                 }
//                 config.response(200, 'Booking and booking details successfully inserted!', {}, res);
//             });
//         });
//     });
// };

userController.addBooking = function (userId, req, res) {

    // Get the last booking number
    db.query(`SELECT MAX(bookingnumber) AS lastBookingNumber FROM booking`, (err, result) => {
        if (err) {
            console.error("Error fetching last booking number:", err);
            return config.response(500, 'Error inserting booking', null, res);
        }

        // Extract the last booking number from the result
        const lastBookingNumber = result[0].lastBookingNumber;

        // Parse the number part and increment it
        const lastNumber = parseInt(lastBookingNumber.replace(/[^\d]/g, ''), 10);
        const newNumber = lastNumber + 1;

        // Construct the new booking number
        const newBookingNumber = 'BG' + newNumber;

        // Extract other fields from the request body
        const { createdBy, updatedBy, created_at, updated_at, isDelete, transactionID } = req.body;

        // Insert into the booking table with the new booking number
        const sql = `INSERT INTO booking(bookingnumber, created_by, updated_by, created_at, updated_at, isDelete, transactionID) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [newBookingNumber, createdBy, updatedBy, created_at, updated_at, isDelete, transactionID];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Error inserting booking:", err);
                return config.response(500, 'Error inserting booking', null, res);
            }

            // Get the last inserted bookingId
            const bookingId = result.insertId;

            // Array of booking details coming from the client-side
            const bookingDetailsArray = req.body.bookingDetailsArray;

            // Loop through each booking detail and insert it into the database
            bookingDetailsArray.forEach(bookingDetail => {
                const bookingDetailsSql = `
                    INSERT INTO booking_details(
                        userId, employeeId, serviceTypeId, bookingDate, 
                        bookingStartTime, bookingEndTime, promocode, tax, 
                        latitude, longitude, bookingStatus, paymentStatus, bookingId
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                const bookingDetailsValues = [
                    userId, bookingDetail.employeeId, bookingDetail.serviceTypeId,
                    bookingDetail.bookingDate, bookingDetail.bookingStartTime, bookingDetail.bookingEndTime,
                    bookingDetail.promocode, bookingDetail.tax, bookingDetail.latitude, bookingDetail.longitude,
                    bookingDetail.bookingStatus, bookingDetail.paymentStatus, bookingId
                ];

                db.query(bookingDetailsSql, bookingDetailsValues, (err, result) => {
                    if (err) {
                        console.error("Error inserting booking details:", err);
                        return config.response(500, 'Error inserting booking details', null, res);
                    }
                });
            });

            // Send the response after all booking details are inserted
            config.response(200, 'Booking and booking details successfully inserted!', {}, res);
        });
    });
};


userController.getBookingDetailList = function (userId, req, res) {

    db.query(`
        SELECT 
            employeeId, serviceTypeId, bookingDate, 
            bookingStartTime, bookingEndTime, promocode, tax, 
            latitude, longitude, bookingStatus, paymentStatus, bookingId,userId
        FROM 
            booking_details
        WHERE 
            userId = ?
    `,
        [userId], (err, result) => {
            if (err) {
                console.error('Error fetching booking details:', err);
                config.response(500, 'Error fetching booking details', null, res);
                return;
            }
            config.response(200, 'Booking Details List Successfully Fetched!', result, res);
            // console.log(result[0].bookingDate)

            // const serviceTypeId = result[0].serviceTypeId

            const { serviceTypeId, employeeId } = result[15];

            db.query(`
            SELECT
               employName
            FROM
               employee 
            WHERE
            id = ? AND isDelete = 0           
        `,
                [employeeId], (err, result) => {
                    if (err) {
                        console.error('Error fetching booking details:', err);
                        config.response(500, 'Error fetching booking details', null, res);
                        return;
                    }

                    console.log("ServiceData========>", result)
                }
            )

            //     db.query(`
            //     SELECT
            //         serviceId, userId, type, price,offer
            //     FROM
            //         sub_services   
            //     WHERE

            //         id = ? AND isDelete = 0           
            // `,
            //         [serviceTypeId, userId], (err, result) => {
            //             if (err) {
            //                 console.error('Error fetching booking details:', err);
            //                 config.response(500, 'Error fetching booking details', null, res);
            //                 return;
            //             }

            //             // console.log("ServiceData========>", result)
            //         }
            //     )

        });



};

// Add booking booking
// userController.addBooking = function (req, res) {
//     const { bookingnumber, createdBy, updatedBy, created_at, updated_at, isDelete, transactionID } = req.body;

//     const sql = `INSERT INTO booking(bookingnumber, created_by, updated_by, created_at, updated_at, isDelete, transactionID) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`;

//     const values = [bookingnumber, createdBy, updatedBy, created_at, updated_at, isDelete, transactionID];

//     db.query(sql, values, (err, result, fields) => {
//         if (err) {
//             console.error("Error inserting booking:", err);
//             return false
//         }
//         return true;
//     });

// }

// add booking booking_details 
// userController.bookingDetails = function (req, res) {
//     db.query("insert into booking_details(userId,employeeId,serviceTypeId,bookingDate,bookingStartTime,bookingEndTime,promocode,tax,latitude,longitude,bookingStatus,paymentStatus,bookingId)values('" + req.body.userId + "','" + req.body.employeeId + "','" + req.body.serviceTypeId + "','" + req.body.bookingDate + "','" + req.body.bookingStartTime + "','" + req.body.bookingEndTime + "','" + req.body.promocode + "','" + req.body.tax + "','" + req.body.latitude + "','" + req.body.longitude + "','" + req.body.bookingStatus + "','" + req.body.bookingId + "','" + req.body.paymentStatus + "')", (err, result, fields) => {
//         if (err) throw err;
//         config.response(200, 'Booking Details Successfully Inserted!', result, res);
//     });

// }

userController.bookingDetailsUpdate = function (req, res) {
    db.query("update booking_details SET locationId='" + req.body.locationId + "',employeeId='" + req.body.employeeId + "',serviceTypeId='" + req.body.serviceTypeId + "',bookingDate='" + req.body.bookingDate + "',bookingStartTime='" + req.body.bookingStartTime + "',bookingEndTime='" + req.body.bookingEndTime + "',promocode='" + req.body.promocode + "',tax='" + req.body.tax + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Booking Location Successfully Update', result, res);
    });
}
userController.bookingDetailsDelete = function (req, res) {
    db.query("DELETE FROM booking_details WHERE id='" + req.body.id + "'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'Booking Location Successfully Deleted!', result, res);
    });
}
userController.bookingDetailsView = function (req, res) {

    db.query("select booking_details.id, service.serviceName,servicetype.price,servicetype.offer,servicetype.type,employee.employName, booking_details.bookingDate,booking_details.bookingStartTime,booking_details.bookingEndTime,booking_details.bookingStatus,booking_details.latitude,booking_details.longitude,booking_details.bookingStatus from booking_details INNER JOIN employee ON employee.id=booking_details.employeeId INNER JOIN servicetype ON servicetype.id=booking_details.serviceTypeId INNER JOIN service ON service.id=servicetype.serviceId where booking_details.userId='" + req.body.userId + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Booking Details Successfully Fatch !', result, res);
    });
}

userController.OldbookingDetailsView = function (req, res) {
    db.query("select  registrations.branchName, booking_details.id, service.serviceName,servicetype.price,servicetype.offer,servicetype.type,employee.employName, booking_details.bookingDate,booking_details.bookingStartTime,booking_details.bookingEndTime,booking_details.bookingStatus,booking_details.latitude,booking_details.longitude,booking_details.bookingStatus from booking_details INNER JOIN employee ON employee.id=booking_details.employeeId INNER JOIN servicetype ON servicetype.id=booking_details.serviceTypeId INNER JOIN service ON service.id=servicetype.serviceId INNER JOIN registrations ON registrations.id=service.shopId where booking_details.userId='" + req.body.userId + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Booking Details Successfully Fatch !', result, res);
    });
}

userController.HistorybookingDetailsView = function (req, res) {
    db.query("select  registrations.branchName, booking_details.id, service.serviceName,servicetype.price,servicetype.offer,servicetype.type,employee.employName, booking_details.bookingDate,booking_details.bookingStartTime,booking_details.bookingEndTime,booking_details.bookingStatus,booking_details.latitude,booking_details.longitude,booking_details.bookingStatus from booking_details INNER JOIN employee ON employee.id=booking_details.employeeId INNER JOIN servicetype ON servicetype.id=booking_details.serviceTypeId INNER JOIN service ON service.id=servicetype.serviceId INNER JOIN registrations ON registrations.id=service.shopId where booking_details.userId='" + req.body.userId + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Booking Details Successfully Fatch !', result, res);
    });
}
// reschdeuled 
userController.reschdeuled = function (req, res) {
    db.query("insert into reschdeuled(bookingId,serviceTypeId,oldBookingDate,oldBookingStartTime,oldBookingEndTime)values('" + req.body.bookingId + "','" + req.body.serviceTypeId + "','" + req.body.oldBookingDate + "','" + req.body.oldBookingStartTime + "','" + req.body.oldBookingEndTime + "')", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Reschdeuled Successfully Inserted!', result, res);
    });

}
userController.reschdeuledUpdate = function (req, res) {
    db.query("update reschdeuled SET bookingId='" + req.body.bookingId + "',serviceTypeId='" + req.body.serviceTypeId + "',oldBookingDate='" + req.body.oldBookingDate + "',oldBookingStartTime='" + req.body.oldBookingStartTime + "',oldBookingEndTime='" + req.body.oldBookingEndTime + "' where id='" + req.body.id + "'", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Reschdeuled Successfully Update', result, res);
    });
}
userController.reschdeuledDelete = function (req, res) {
    db.query("DELETE FROM reschdeuled WHERE id='" + req.body.id + "'", function (err, result, fields) {
        if (err) throw err;
        config.response(200, 'reschdeuled Successfully Deleted!', result, res);
    });
}
userController.reschdeuledView = function (req, res) {

    db.query("select * from  reschdeuled", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'reschdeuled Successfully Fatch !', result, res);
    });
}

// reschdeuled 
userController.canclled = function (req, res) {
    db.query("insert into canclled(bookingId,serviceTypeId,oldBookingDate,oldBookingStartTime,oldBookingEndTime)values('" + req.body.bookingId + "','" + req.body.serviceTypeId + "','" + req.body.oldBookingDate + "','" + req.body.oldBookingStartTime + "','" + req.body.oldBookingEndTime + "')", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'canclled Successfully Inserted!', result, res);
    });

}

//slots
userController.showSlots = (req, res) => {
    const offerpackquery = "SELECT employee.employName AS employName,employee.employNo AS employNo,slots.date AS date,slots.startTime AS startTime,slots.endTime AS endTime  FROM slots INNER JOIN employee ON employee.id=slots.employeeId where slots.date='" + req.body.date + "' and slots.serviceTypeId='" + req.body.serviceTypeId + "'";
    db.query(offerpackquery, (err, result, fields) => {
        if (err) throw err;

        const bookdate = "SELECT employee.employName AS employName,employee.employNo AS employNo,booking_details.bookingDate as date ,booking_details.bookingStartTime as startTime,booking_details.bookingEndTime as endTime FROM booking_details INNER JOIN employee ON employee.id=booking_details.employeeId where booking_details.bookingDate='" + req.body.date + "' and booking_details.serviceTypeId='" + req.body.serviceTypeId + "' and bookingStatus=1";
        db.query(bookdate, (error, resultdata, fieldsdata) => {
            if (error) throw error;
            console.log(result, resultdata);
            const resultdataall = removeMatchingData(result, resultdata);
            alldata = resultdataall.map((setdata) => {
                return {
                    date: setdata.date,
                    startTime: setdata.startTime,
                    endTime: setdata.endTime
                }
            })
            const uniqueData = removeDuplicates(alldata);
            config.response(200, 'Service Data Successfully Fatch !', uniqueData, res);
        })


    });
}
function removeMatchingData(array1, array2) {
    return array1.filter(obj1 => {
        return !array2.some(obj2 => {
            return (
                obj1.employName === obj2.employName &&
                obj1.employNo === obj2.employNo &&
                obj1.date.getTime() === obj2.date.getTime() &&
                obj1.startTime === obj2.startTime &&
                obj1.endTime === obj2.endTime
            );
        });
    });
}
function removeDuplicates(data) {
    const uniqueData = [];
    const uniqueSet = new Set();

    for (const item of data) {
        const itemString = JSON.stringify(item);
        if (!uniqueSet.has(itemString)) {
            uniqueSet.add(itemString);
            uniqueData.push(item);
        }
    }

    return uniqueData;
}

//search autocomplete

userController.autoCompleteSearch = function (req, res) {
    db.query("select registrations.branchName,service.serviceName,servicetype.type  from servicetype  INNER JOIN service ON service.id=servicetype.serviceId  INNER JOIN registrations ON registrations.id=service.shopId  where service.serviceName like '%" + req.body.search + "%'  or servicetype.type like '%" + req.body.search + "%'  or registrations.branchName like '%" + req.body.search + "%'  limit 8", (err, result, fields) => {
        if (err) throw err;
        config.response(200, 'Search fetch Successfully Inserted!', result, res);
    });

}

module.exports = userController;