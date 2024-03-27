import jwt from "jsonwebtoken";
import { JWT_SECRET_TOKEN, JWT_EXPIRES_IN, mailer, EMAIL_FROM, S3, AWS_S3_BUCKET, EXPIRES_SINGNED_URL, SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, SHIPROCKET_TRACKING_LINK, SHIPROCKET_COMPANY_ID, IMAGE_ANALYSIS_API_KEY, IMAGE_ANALYSIS_API_KEY_AILABS, FIREBASE_SERVER_KEY, MSG91_AUTH_KEY, MSG91_TEMPLATE_ID } from "../config/config.js";
import User from "../models/User.js";
import axios from "axios";
import Upload from "../models/Upload.js";
import Setting from "../models/Setting.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Wishlist from "../models/Wishlist.js";
import crypto from "crypto";
import Message from "../models/Message.js";
import ChatbotMessage from "../models/ChatbotMessage.js";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import FormData from 'form-data';
import Symtom from "../models/Symtom.js";
import kit from "../models/kit.js";
import lodash from "lodash"
import Notification from "../models/Notification.js";
import DoctorDetail from "../models/DoctorDetail.js";

export const getJwtToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET_TOKEN, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export const getReferralCode = () => {
    return new Promise(async (resolve, reject) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let length = 10;
        let retVal = Array.from(crypto.randomFillSync(new Uint32Array(length)))
            .map((value) => charset.charCodeAt(value % charset.length))
            .map((charCode) => String.fromCharCode(charCode))
            .join('');
        if (!await User.findOne({ referralCode: retVal })) {
            return resolve(retVal);
        } else {
            getReferralCode();
        }
    });
}

export const shiprocketAuthToken = () => {
    return new Promise((resolve, reject) => {
        axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD
        }).then((response) => {
            resolve(response.data.token);
        }).catch((error) => {
            reject(new Error(error));
        });
    })
}

export const errorResponse = (res) => {
    res.status(500).send({ status: false, msg: "Something Went Wrong" });
}

export const authValues = async (authToken) => {
    let result = jwt.verify(authToken, JWT_SECRET_TOKEN);
    let user = await User.findById(result.userId);
    return user;
}

export const isTokenVerified = (authToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(authToken, JWT_SECRET_TOKEN, async (err, result) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

export const getNextCustomerId = async () => {
    return new Promise(async (resolve, reject) => {
        User.find({ isRegistered: true, type: "customer" }).count().then((count) => {
            if (count > 0) {
                resolve("SKINOCARE0" + (Number(1) + count));
            } else {
                resolve("SKINOCARE0" + (Number(1)));
            }
        });
    })
}

export const getNextOrderNo = async () => {
    return new Promise(async (resolve, reject) => {
        Order.find().count().then((count) => {
            if (count > 0) {
                resolve("SOCOD" + (Number(1000001) + count));
            } else {
                resolve("SOCOD" + Number(1000001));
            }
        });
    });
}

export const responseWithData = (res, code, status, message, data) => {
    res.status(code).send({ status: status, msg: message, data: data });
}

export const responseWithoutData = (res, code, status, message,) => {
    res.status(code).send({ status: status, msg: message, data: [] });
}

export const emailVerification = (to, subject, otp) => {

    let body = "Hello! Your One-Time Password (OTP) for verification is: " + otp + ". Please use this code to complete your verification. This OTP is valid for 10 min. Do not share it with anyone for security reasons."

    mailer.sendMail({
        from: EMAIL_FROM, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
        // html: "<b>Hello world?</b>", // html body
    });
}

export const emailNotification = (to, subject, body) => {
    mailer.sendMail({
        from: EMAIL_FROM,               // Sender address
        to: to,                         // List of receivers
        subject: subject,               // Subject line
        html: body,                     // Html body
        // text: body,                  // Plain text body
    });
}

export const sendMobileOtpOld = (mobile, otp) => {
    axios.get(`http://sms.softfix.in/submitsms.jsp?user=EsafeS&key=d5a7374c54XX&mobile=${mobile}&message=Dear%20User,%20Your%20OTP%20for%20login%20to%20Jio%20TrueConnect%20portal%20is%20Your%20SkinOCare%20OTP%20is%20${otp}%20.%20Valid%20for%2030%20minutes.%20Please%20do%20not%20share%20this%20OTP.%20Regards,%20Jio%20Trueconnect%20Team&senderid=DEALDA&accusage=1&entityid=1201159965850654415&tempid=1207167722926890489`).then((response) => {
        return true;
    }).catch((error) => {
        throw new Error(error);
    });
}

export const sendMobileOtp = async (mobile, otp) => {
    let data = JSON.stringify({
        "purpose": "Verification"
    });
    
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://control.msg91.com/api/v5/otp?template_id=${MSG91_TEMPLATE_ID}&mobile=91${mobile}&otp=${otp}`,
        headers: { 
            'accept': 'application/json', 
            'authkey': MSG91_AUTH_KEY, 
            'content-type': 'application/json', 
            'Cookie': 'PHPSESSID=sc5jtbhtfg0ooavoj9fihetjr7'
        },
        data : data
    };
    
    axios.request(config)
    .then((response) => {
        // console.log(response);
        return true;
    })
    .catch((error) => {
        throw new Error(error);
    });  
}

export const uploadToS3 = (fileName, filePath, fileData) => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: AWS_S3_BUCKET,
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

export const getImageSingedUrlById = async (uploadId) => {
    let uploadData = await Upload.findOne({ _id: uploadId });
    return await getSignUrl(uploadData?.filePath + '/' + uploadData?.fileName);
}

export const getSignedUrl = async (fileKey, callback) => {
    S3.getSignedUrl('getObject', {
        Bucket: AWS_S3_BUCKET,
        Key: fileKey,
        Expires: EXPIRES_SINGNED_URL,
    }, (err, url) => {
        if (!err) {
            callback(null, url); // Return the URL via the callback
        } else {
            callback(err); // Handle errors via the callback
        }
    });

}

export const getAverageRating = async (productId) => {
    return new Promise(async (resolve, reject) => {
        let averageRating = await Review.aggregate([
            { $match: { productId: productId } },
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        resolve((averageRating.length > 0) ? averageRating?.[0]?.avgRating : 0);
    });
}


export const getSignUrl = async (fileKey) => {
    let url = await S3.getSignedUrlPromise('getObject', {
        Bucket: AWS_S3_BUCKET,
        Key: fileKey,
        Expires: EXPIRES_SINGNED_URL,
    });
    return url;
}

export const isStock = async (productId, quantity) => {
    let product = await Product.findById(productId);
    return product?.currentStock - quantity >= 0;
}

export const isCartStock = async (customerId) => {
    let carts = await Cart.find({ customerId });
    for (let cart of carts) {
        if (!await isStock(cart?.productId, cart?.quantity)) {
            return false
        }
    }
    return true;
}

export const destroyToken = async (authToken) => {
    // let result = await jwt.
    // return result;
}

export const isCart = async (user, productId) => {
    return new Promise(async (resolve, reject) => {
        let cart = await Cart.findOne({ customerId: user?._id, productId: productId });
        if (cart) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}

export const isWishlist = async (user, productId) => {
    return new Promise(async (resolve, reject) => {
        let wishlist = await Wishlist.findOne({ customerId: user?._id, productId: productId });
        if (wishlist) {
            resolve(true);
        } else {
            resolve(false);
        }
    })
}


export const appliedCouponValue = async (couponCode, totalAmount, res, customerId) => {
    let coupon = await Coupon.findOne({ code: couponCode, isDeleted: false });
    if (coupon == null) {
        return responseWithoutData(res, 404, false, "No Coupon Found!!");
    }
    if (new Date() > new Date(coupon?.expiredAt)) {
        return responseWithoutData(res, 400, false, "Coupon has been expired!!");
    }
    if (coupon?.totalLimit > 0 && coupon?.balanceLimit < 1) {
        return responseWithoutData(res, 400, false, "Coupon has used in maximum limit!!");
    }
    let checkUseCoupon = await Order.findOne({ customerId: customerId, couponCode: coupon?.code, orderStatus: { $ne: "cancelled" } });

    if (checkUseCoupon != null) {
        return responseWithoutData(res, 400, false, "You have already used this coupon!!");
    }
    let discountAmount = 0;
    if (coupon?.type == 'flat') {
        discountAmount = (Number(coupon?.discount) > Number(totalAmount)) ? Number(totalAmount) : Number(coupon?.discount);
    } else if (coupon?.type == 'percentage') {
        discountAmount = (Number(totalAmount) * Number(coupon?.discount)) / 100;
        if (Number(coupon?.discountUpTo) > 0) {
            discountAmount = (Number(discountAmount) > Number(coupon?.discountUpTo)) ? Number(coupon?.discountUpTo) : Number(discountAmount)
        }
        discountAmount = (Number(discountAmount) > Number(totalAmount)) ? Number(totalAmount) : Number(discountAmount)
    }
    return discountAmount;
}

export const getShiprokectTrakingLink = (orderId) => {
    return `${SHIPROCKET_TRACKING_LINK}/${orderId}?company_id=${SHIPROCKET_COMPANY_ID}`
}

export const autoSendMessageByBot = async (socket, type, regenerateChat, userMessage,userConcern, isSocketConnect) => {
    return new Promise(async (resolve, reject) => {
        // (regenerateChat == true) ? await Message.deleteMany({ customerId: socket.customerId, type: type }) : '';
        if(regenerateChat == true){
            await Message.deleteMany({ customerId: socket.customerId, type: type });
            let kitId =  type+'KitId';
            let kitDoctor =  type+'Doctor';
            let kitConcern =  type+'Concern';
            let kitGenDate =  type+'KitGenDate';
            await User.findByIdAndUpdate(socket.customerId,{$set:{[kitId]:null,[kitDoctor]:null,[kitConcern]:null,[kitGenDate]:null}});
        }
        let messages = await Message.find({ customerId: socket.customerId, isSendByBot: true, type: type });
        let message = await Message.findOne({ customerId: socket.customerId, isSendByBot: true, type: type }).sort({ createdAt: -1 });
        let userData = await User.findById(socket.customerId);
        let selectChatMessage = [];
        let selectnextMassage = [];
        let create_message = [];
        if (message && !regenerateChat) {
            selectChatMessage = await ChatbotMessage.findById(message.botMessageId);
            if (!selectChatMessage?.nextMessageId?.length > 0) {
                resolve({});
            } else {
                selectnextMassage = await ChatbotMessage.findById(selectChatMessage?._id).select("message option nextMessageId isSelectOption isExit isTypable");
                if (isSocketConnect) {
                    let makeNextChatCondition = await getNextMessageId(selectChatMessage?.nextMessageId,userMessage,userConcern);
                    selectnextMassage = await ChatbotMessage.findById(makeNextChatCondition).select("message option nextMessageId isSelectOption isExit isTypable");
                    selectnextMassage = {...selectnextMassage._doc,message:selectnextMassage?.message?.replace("{{name}}", userData?.name)}
                    if(message?.message != selectnextMassage?.message){ 
                        create_message = await Message.create({
                            message: selectnextMassage?.message,
                            type: type,
                            customerId: socket.customerId,
                            botMessageId: selectnextMassage?._id,
                            isSendByBot: true,
                        });
                    }
                }
            }
        } else {
            selectnextMassage = type == "skin" ? await ChatbotMessage.findById("659bb1e244cd0a642edfd956") : await ChatbotMessage.findById("659bc52444cd0a642edfd963");
            if(message?.message != 'Welcome to SkinOcare!'){     
                create_message = await Message.create({
                    message: selectnextMassage?.message,
                    botMessageId: selectnextMassage?._id,
                    type: type,
                    customerId: socket.customerId,
                    isSendByBot: true,
                });
            }
        }
        // console.log("selectnextMassage",selectnextMassage);
        resolve(selectnextMassage);
    });
}
export const saveUserMessage = async (customerId, message, type , isImage) => {

    return new Promise(async (resolve, reject) => {
        let create_message = await Message.create({
            message: message,
            customerId: customerId,
            isSendByBot: false,
            type: type,
            isImage:isImage
        });
        resolve(create_message);
    });
}

export const getNextMessageId = async (nextMessageId,userMessage,userConcern) => {
    let selectMessageId = '';
    userMessage = userMessage.trim();
    for(let nextMessage of nextMessageId){
        for(let checkOption of nextMessage?.option){
            if(selectMessageId == '') {
                if(userMessage.toLowerCase() == checkOption.toLowerCase()) {
                    selectMessageId = nextMessage?.id;
                }else {
                    let splitCon = checkOption.split("-");
                    if(nextMessage?.concern) {
                        // console.log(splitCon?.[0],splitCon?.[1],userMessage.toLowerCase(),checkOption.toLowerCase());
                        if(splitCon?.[0]?.toLowerCase() == 'not' && checkOption?.[1]?.toLowerCase() != userMessage.toLowerCase() && nextMessage?.concern?.toLowerCase() == userConcern?.toLowerCase()) {
                            selectMessageId = nextMessage?.id;
                        }
                    } else {
                        if(splitCon?.[0]?.toLowerCase() == 'not' && checkOption?.[1]?.toLowerCase() != userMessage.toLowerCase()) {
                            selectMessageId = nextMessage?.id;
                        }
                    }
                }
            }
        }
    }
    return selectMessageId;
}
// export const getRecentMessage = async(customerId)=>{
//     return new Promise(async(resolve, reject)=>{
//         let message = await Message.findOne({ customerId:customerId, isSendByBot: true  }).sort({ createdAt: -1 });
//         let selectChatMessage = [];
//         if(message){
//             selectChatMessage = await ChatbotMessage.findById(message.botMessageId);
//         }else{
//             selectChatMessage = await ChatbotMessage.findById("65842f87e54ada186acf100a");
//         }
//         resolve(selectChatMessage);
//     });
// }


export const getImageWithAcneSpot = async (imagePath, drawCircleParams, outputImagePath) => {
    // console.log('imageDetails',imagePath,drawCircleParams);
    // Border color (red in this case)

    return new Promise(async (resolve, reject) => {
        const borderColor = 0xFF0000; // Hex color code for red

        loadImage(imagePath).then(async (image) => {
            // Create a canvas with the same dimensions as the image
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');

            // Draw the original image on the canvas
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const color = 'red';
            for (let circleIndex in drawCircleParams) {
                ctx.beginPath();
                let drawImageParam = drawCircleParams?.[circleIndex];
                let centerX = (drawImageParam?.center_x != undefined) ? drawImageParam?.center_x : drawImageParam?.x;
                let centerY = (drawImageParam?.center_y != undefined) ? drawImageParam?.center_y : drawImageParam?.y;
                let radius = ((drawImageParam?.radius != undefined) ? drawImageParam?.radius : drawImageParam?.r) * 8; // Adjust the radius as needed
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2; // Adjust the line width as needed
                ctx.stroke();
            }

            // Save the modified image to a new file
            const outputStream = await fs.createWriteStream(outputImagePath);
            const output = canvas.createPNGStream();
            output.pipe(outputStream);

            outputStream.on('finish', () => {
                // console.log('Circle drawn with red border and saved to', outputImagePath);
                resolve(outputImagePath);
            });
        }).catch((err) => {
            reject(err);
        });
    });

}

export const callImageAnalysisApi = async (image) => {
    // return 1;
    const data = new FormData();
    data.append('image', fs.createReadStream(image));
    // data.append('image', image);
    data.append('max_face_num', '1');
    data.append('face_field', 'color,smooth,acnespotmole,wrinkle,eyesattr,blackheadpore,skinface,skinface,skinquality');

    const options = {
        method: 'POST',
        url: 'https://skin-analysis.p.rapidapi.com/face/effect/skin_analyze',
        headers: {
            'X-RapidAPI-Key': IMAGE_ANALYSIS_API_KEY,
            'X-RapidAPI-Host': 'skin-analysis.p.rapidapi.com',
            ...data.getHeaders(),
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return { ...error?.response?.data, status: false };
    }
}

export const uploadImageSkinAnalysis = async (imagePath, userId) => {
    const imageBuffer = fs.readFileSync(imagePath);
    const getExtansion = imagePath?.split(".");
    let fileName = `${(new Date()).getTime()}.${getExtansion?.[(getExtansion.length - 1)]}`;
    let filePath = `uploads/skin-analysis/${userId}`;
    await uploadToS3(fileName, filePath, imageBuffer);
    let uploadImage = await Upload.create({
        fileName: fileName,
        filePath: filePath,
        relatedWith: 'skinAnalysisReport',
        addedBy: userId,
    });
    return uploadImage;
}


export const base64toimageAndUploadToServer = async (base64Data, outputImagePath, userId) => {
    await saveBase64AsPNG(base64Data, outputImagePath);
    let imageUploadId = await uploadImageSkinAnalysis(outputImagePath, userId);
    return imageUploadId?._id;
}

// Function to save a Base64-encoded image as a PNG file
export const saveBase64AsPNG = (base64Data, outputPath) => {
    // Decode Base64 to a buffer
    const imageBuffer = decodeBase64ToBuffer(base64Data);

    // Write the buffer to a PNG file
    fs.writeFileSync(outputPath, imageBuffer, { encoding: 'base64' });

    // console.log(`Image saved as ${outputPath}`);
}

// Function to decode Base64 to an image buffer
export const decodeBase64ToBuffer = (base64Data) => {
    return base64Data ? Buffer.from(base64Data, 'base64') : '';
}

export const callImageAnalysisApiNew = async (image) => {
    // return 1; 
    const data = new FormData();
    data.append('image', fs.createReadStream(image));
    // data.append('image', image);
    data.append('return_maps', 'red_area,brown_area,texture_enhanced_pores,texture_enhanced_blackheads,texture_enhanced_oily_area,texture_enhanced_lines,water_area,rough_area,roi_outline_map,texture_enhanced_bw');

    data.append('return_marks', 'wrinkle_mark,right_nasolabial_list,right_mouth_list,right_eye_wrinkle_list,right_crowsfeet_list,right_cheek_list,left_nasolabial_list,left_mouth_list,left_eye_wrinkle_list,left_crowsfeet_list,left_cheek_list,glabella_wrinkle_list,forehead_wrinkle_list,dark_circle_outline,sensitivity_mark,melanin_mark,dark_circle_outline,cheekbone_mark');

    const options = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://www.ailabapi.com/api/portrait/analysis/skin-analysis-pro',
        headers: {
            'ailabapi-api-key': IMAGE_ANALYSIS_API_KEY_AILABS,
            ...data.getHeaders()
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return { ...error?.response?.data, status: false };
    }
}

export const customizeAnalysisReport = async (reportData) => {
    return {
        _id: (reportData) ? reportData?._id : null,
        createdAt: (reportData) ? reportData?.createdAt : null,
        uploadedImageFront: (reportData) ? await getImageSingedUrlById(reportData?.frontFaceImage) : null,
        uploadedImageLeft: null,
        uploadedImageRight: null,
        analysisResult: [
            {
                problem: 'Brown Area',
                image: (reportData?.brown_area) ? await getImageSingedUrlById(reportData?.brown_area) : null
            },
            {
                problem: 'Red Area',
                image: (reportData?.red_area) ? await getImageSingedUrlById(reportData?.red_area) : null
            },
            {
                problem: 'Roi Outline Map',
                image: (reportData?.roi_outline_map) ? await getImageSingedUrlById(reportData?.roi_outline_map) : null
            },
            {
                problem: 'Rough Area',
                image: (reportData?.rough_area) ? await getImageSingedUrlById(reportData?.rough_area) : null
            },
            {
                problem: 'Texture Enhanced Blackheads',
                image: (reportData?.texture_enhanced_blackheads) ? await getImageSingedUrlById(reportData?.texture_enhanced_blackheads) : null
            },
            {
                problem: 'Texture Enhanced bw',
                image: (reportData?.texture_enhanced_bw) ? await getImageSingedUrlById(reportData?.texture_enhanced_bw) : null
            },
            {
                problem: 'Texture Enhanced Lines',
                image: (reportData?.texture_enhanced_lines) ? await getImageSingedUrlById(reportData?.texture_enhanced_lines) : null
            },
            {
                problem: 'Texture Enhanced Oily Area',
                image: (reportData?.texture_enhanced_oily_area) ? await getImageSingedUrlById(reportData?.texture_enhanced_oily_area) : null
            },
            {
                problem: 'Texture Enhanced Pores',
                image: (reportData?.texture_enhanced_pores) ? await getImageSingedUrlById(reportData?.texture_enhanced_pores) : null
            },
            {
                problem: 'Water Area',
                image: (reportData?.water_area) ? await getImageSingedUrlById(reportData?.water_area) : null
            },
        ]
    };
}

export const drawPolygonOnImage = async (inputImagePath, outputImagePath, polygonVertices) => {
    try {
        // Load the input image
        const image = await loadImage(inputImagePath);

        // Create a canvas matching the image dimensions
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');

        // Draw the input image on the canvas
        ctx.drawImage(image, 0, 0, image.width, image.height);
        for (let verticeIndex in polygonVertices) {
            let vertices = polygonVertices?.[verticeIndex];
            // Draw the polygon on the canvas
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (const vertex of vertices) {
                ctx.lineTo(vertex.x, vertex.y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0)'; // Red polygon with 50% transparency
            ctx.fill();

            // Draw a red border around the polygon
            ctx.lineWidth = 2; // Adjust border width as needed
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }

        // Save the canvas to an image file
        const stream = fs.createWriteStream(outputImagePath);
        const out = canvas.createJPEGStream();
        out.pipe(stream);
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        // console.log('Polygon drawn successfully!');
    } catch (error) {
        console.error('Error drawing polygon:', error);
    }
}


export const darkCircleDraw = async (MarkDatas, outputImagePath, userId, inputImagePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Load the image
            const img = await loadImage(inputImagePath);

            // Create a canvas with the same dimensions as the image and a transparent background
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');

            // Set the canvas background to transparent
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Set the color of the rectangle with transparency (R, G, B, A)
            const rectColor = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent green
            const rectBorderColor = 'rgba(255, 0, 0, 1)';  // Red border
            const rectBorderWidth = 2;
            // Draw the rectangle on the canvas
            for (let markIndex in MarkDatas) {
                let markdata = MarkDatas?.[markIndex];
                await drawRectangleWithBorder(ctx, markdata?.left, markdata?.top, markdata?.width, markdata?.height, rectColor, rectBorderColor, rectBorderWidth);
            }

            // Save the edited image
            const out = fs.createWriteStream(outputImagePath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on('finish', () => console.log('Image saved.'));
            let imageUploadId = await uploadImageSkinAnalysis(outputImagePath, userId);
            resolve(imageUploadId?._id);
        } catch (error) {
            console.error('Error:', error);
            reject(error);
        }
    });
}

export const drawRectangleWithBorder = (ctx, x, y, width, height, fillColor, borderColor, borderWidth) => {
    // Draw the filled rectangle
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);

    // Draw the border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(x, y, width, height);
}


export const callImageAnalysisApiAdvanced = async (image) => {
    // return 1;
    const data = new FormData();
    data.append('image', fs.createReadStream(image));
    data.append('return_maps', 'red_area');

    const options = {
        method: 'POST',
        url: 'https://skin-analyze-advanced.p.rapidapi.com/facebody/analysis/skinanalyze-advanced',
        headers: {
            'X-RapidAPI-Key': IMAGE_ANALYSIS_API_KEY,
            'X-RapidAPI-Host': 'skin-analyze-advanced.p.rapidapi.com',
            ...data.getHeaders(),
        },
        data: data
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        return { ...error?.response?.data, status: false };
    }
}

export const skinAnalysisRapidData = async (analysisData) => {
    let skinAnalysisReportData = {
        _id: analysisData?._id,
        createdAt: analysisData?.createdAt,
        uploadedImageFront: await getImageSingedUrlById(analysisData?.frontFaceImage),
        uploadedImageLeft: null,
        uploadedImageRight: null,
        analysisResult: []
    };
    if (analysisData?.resltPimpleImage) {
        skinAnalysisReportData?.analysisResult?.push({ problem: 'Acne', image: await getImageSingedUrlById(analysisData?.resltPimpleImage) });
    }
    if (analysisData?.resltblackheadImage) {
        skinAnalysisReportData?.analysisResult?.push({ problem: 'Blackheads', image: await getImageSingedUrlById(analysisData?.resltblackheadImage) });
    }
    if (analysisData?.resltblackheadPoreImage) {
        skinAnalysisReportData?.analysisResult?.push({ problem: 'Pores', image: await getImageSingedUrlById(analysisData?.resltblackheadPoreImage) });
    }
    if (analysisData?.resltwrinkleImage) {
        skinAnalysisReportData?.analysisResult?.push({ problem: 'Wrinkles', image: await getImageSingedUrlById(analysisData?.resltwrinkleImage) });
    }
    if (analysisData?.reslteyesattrImage) {
        skinAnalysisReportData?.analysisResult?.push({ problem: 'Dark Circle', image: await getImageSingedUrlById(analysisData?.reslteyesattrImage) });
    }
    if (analysisData?.resltdarkSpotImage) {
        skinAnalysisReportData?.analysisResult?.push({ problem: 'Dark Spot', image: await getImageSingedUrlById(analysisData?.resltdarkSpotImage) });
    }
    // if (analysisData?.srcImage) {
    //     skinAnalysisReportData?.analysisResult?.push({ problem: 'Src Image', image: await getImageSingedUrlById(analysisData?.srcImage) });
    // }
    // if (analysisData?.grayImage) {
    //     skinAnalysisReportData?.analysisResult?.push({ problem: 'Gray Image', image: await getImageSingedUrlById(analysisData?.grayImage) });
    // }
    // if (analysisData?.brownImage) {
    //     skinAnalysisReportData?.analysisResult?.push({ problem: 'Brown Image', image: await getImageSingedUrlById(analysisData?.brownImage) });
    // }
    // if (analysisData?.redImage) {
    //     skinAnalysisReportData?.analysisResult?.push({ problem: 'Red Image', image: await getImageSingedUrlById(analysisData?.redImage) });
    // }
    return skinAnalysisReportData;
}


export const generateHairKit =  async (customer,problem) => {
    let symptomIds = [];
    problem = problem.trim();
    // problem = problem.split(" ");
    // let orQureyForSymptom = [];
    // for (let problemSplitIndex in problem) {
    //     let problemSplit = problem?.[problemSplitIndex];
    //     orQureyForSymptom.push({name:{$regex:problemSplit}});
    // }
    let symptoms = null;
    let getKitBySymptomIds = null;
    // symptoms = await Symtom.find({type:"hair",$or:orQureyForSymptom});  
    symptoms = await Symtom.find({type:"hair",name:new RegExp(problem, 'i')});
    symptomIds = (symptoms.length > 0 ) ? symptoms.map((s)=>s?._id?.toString()) : null ;
    getKitBySymptomIds = await kit.findOne({isActive:true,symtom:{$in:symptomIds}});
    if(getKitBySymptomIds == null) {
        let symptoms = await Symtom.findOne({type:"hair",name:new RegExp("general","i")});
        getKitBySymptomIds = await kit.findOne({isActive:true,symtom:{$in:[symptoms?._id?.toString()]}}); 
    }
    let doctorData = await DoctorDetail.find({isActive:true,isDeleted:false}).distinct("_id");
    let selectRandomDoctor = Math.ceil(Math.random() * (doctorData.length));
    let assignDoctor = (selectRandomDoctor > 0 ) ? doctorData?.[(selectRandomDoctor-1)] : doctorData?.[selectRandomDoctor];
    await User.findByIdAndUpdate(customer,{$set:{hairKitId:getKitBySymptomIds?._id,hairKitGenDate:new Date(),hairDoctor:assignDoctor.toString(),hairConcern:problem}});
    return getKitBySymptomIds;
}

export const generateSkinKit =  async (customer,problem) => {
    let symptomIds = [];
    problem = problem.trim();
    // problem = problem.split(" ");
    // let orQureyForSymptom = [];
    // for (let problemSplitIndex in problem) {
    //     let problemSplit = problem?.[problemSplitIndex];
    //     orQureyForSymptom.push({name:{$regex:problemSplit}});
    // }
    let symptoms = null;
    let getKitBySymptomIds = null;
    // symptoms = await Symtom.find({type:"hair",$or:orQureyForSymptom});
    let userData = await User.findById(customer);
    symptoms = await Symtom.find({type:"skin",name:new RegExp(problem, 'i')});
    symptomIds = (symptoms.length > 0 ) ? symptoms.map((s)=>s?._id?.toString()) : null ;
    if(userData?.gender?.toLowerCase() == 'female') {
        getKitBySymptomIds = await kit.findOne({isActive:true,symtom:{$in:symptomIds}});
    }else {
        getKitBySymptomIds = await kit.findOne({isActive:true,symtom:{$in:symptomIds},_id:{$ne:"659d57a5bb6c5a44789170bf"}});
    }
    if(getKitBySymptomIds == null) {
        let symptoms = await Symtom.findOne({type:"skin",name:new RegExp("general","i")});
        getKitBySymptomIds = await kit.findOne({isActive:true,symtom:{$in:[symptoms?._id?.toString()]}}); 
    }
    let doctorData = await DoctorDetail.find({isActive:true,isDeleted:false}).distinct("_id");
    let selectRandomDoctor = Math.ceil(Math.random() * (doctorData.length));
    let assignDoctor = doctorData?.[(selectRandomDoctor-1)];
    await User.findByIdAndUpdate(customer,{$set:{skinKitId:getKitBySymptomIds?._id,skinKitGenDate:new Date(),skinDoctor:assignDoctor.toString(),skinConcern:problem}});
    return getKitBySymptomIds;
}

export const skinKitGenerateWithApi = async (basicApiRes,advanceApiRes,userId) => {
    let skinProblem = {};
    skinProblem.darkSpot = advanceApiRes?.result?.skin_spot?.rectangle?.length;
    skinProblem.acneScarSkin = basicApiRes?.result?.face_list?.[0]?.blackheadpore?.pore_num;
    skinProblem.skinTone = advanceApiRes?.result?.skintone_ita?.skintone;
    skinProblem.comedonesSkin = advanceApiRes?.result?.closed_comedones?.rectangle?.length;
    skinProblem.blackheadSkin = basicApiRes?.result?.face_list?.[0]?.blackheadpore?.blackhead_num;
    skinProblem.wrinkleSkin = basicApiRes?.result?.face_list?.[0]?.wrinkle?.wrinkle_num;
    skinProblem.moleSkin = advanceApiRes?.result?.mole?.rectangle?.length;
    skinProblem.skinCheck = 0;
    basicApiRes?.result?.face_list?.[0]?.skinquality?.skin_dryoil_check.map((count)=>{
        skinProblem.skinCheck += Number(count);
    });
    skinProblem.skinCheck /= 5;
    skinProblem.skinSensitiveCheck = Number(basicApiRes?.result?.face_list?.[0]?.skinquality?.skin_sensitive_check?.[0]);
    let skinProblemsData = [];
    (skinProblem.darkSpot > 0) ? skinProblemsData.push(new RegExp('DarkSpots/Marks')) : null;
    (skinProblem.acneScarSkin > 0) ? skinProblemsData.push(new RegExp('Acne/Pimples')) : null;
    (skinProblem.skinTone == 3) ? skinProblemsData.push(new RegExp('Sun Tanning')) : null;
    (skinProblem.skinTone > 3) ? skinProblemsData.push(new RegExp('Dull Skin')) : null;
    (skinProblem.comedonesSkin > 0) ? skinProblemsData.push(new RegExp('Comedones')) : null;
    (skinProblem.blackheadSkin > 0) ? skinProblemsData.push(new RegExp('Blackhead')) : null;
    (skinProblem.wrinkleSkin > 0) ? skinProblemsData.push(new RegExp('Anti-aging/Wrinkles')) : null;
    (skinProblem.moleSkin > 0) ? skinProblemsData.push(new RegExp('Mole')) : null;
    (skinProblem.skinCheck > 0 && skinProblem.skinCheck < 0.75) ? skinProblemsData.push(new RegExp('Dry Skin')) : null;
    (skinProblem.skinCheck >= 1.5 ) ? skinProblemsData.push(new RegExp('Oily Skin')) : null;
    (skinProblem.skinSensitiveCheck == 2 ) ? skinProblemsData.push(new RegExp('Sensitive Skin')) : null;
    let symptoms = await Symtom.find({type:"skin",name:{$in:skinProblemsData}}).distinct("_id");
    symptoms = symptoms.map((sData)=>sData?.toString());
    let userData = await User.findById(userId);
    let kits = [];
    if(userData?.gender?.toLowerCase() == 'female') {
        kits = await kit.find({isActive:true,symtom:{$in:symptoms}});
    }else {
        kits = await kit.find({isActive:true,symtom:{$in:symptoms},_id:{$ne:"659d57a5bb6c5a44789170bf"}});
    }
    kits = kits.map((kData) => {
        let countMatch = 0;
        symptoms.map((symptomData)=> { 
            if(kData?.symtom?.includes(symptomData)) { countMatch++; }
        });
        return {...kData._doc,countMatch};
    });
    let doctorData = await DoctorDetail.find({isActive:true,isDeleted:false}).distinct("_id");
    let selectRandomDoctor = Math.ceil(Math.random() * (doctorData.length));
    let assignDoctor = doctorData?.[(selectRandomDoctor-1)];
    let selectRandomProblem = Math.ceil(Math.random() * (skinProblemsData.length));
    let problem = skinProblemsData?.[selectRandomProblem];
    if(kits.length == 0) {
        let symptoms = await Symtom.findOne({type:"skin",name:new RegExp("general","i")});
        getKitBySymptomIds = await kit.findOne({symtom:{$in:[symptoms?._id?.toString()]}}); 
        await User.findByIdAndUpdate(userId,{$set:{skinKitId:getKitBySymptomIds?._id,skinKitGenDate:new Date(),skinDoctor:assignDoctor.toString(),skinConcern:problem}});
        return getKitBySymptomIds;
    } else {
        let maxKitsSort =   lodash.sortBy(kits, [function (kit) { return kit.countMatch; }]);
        let finalKitData = maxKitsSort[maxKitsSort.length-1];
        await User.findByIdAndUpdate(userId,{$set:{skinKitId:finalKitData?._id,skinKitGenDate:new Date(),skinDoctor:assignDoctor.toString(),skinConcern:problem}});
        return finalKitData;
    }
}


export const sendPushNotification = async (customerId,title,body,image,url) => {
    let notification = {
        customerId : customerId,
        title      : title,
        body       : body,
        image      : (image) ? image : '',
        url        : url
    }
    await Notification.create(notification);
    let imageUrl = (image) ? await getImageSingedUrlById(image) : "";
    let deviceId = await getDeviceIdByCustomerId(customerId);
    (deviceId) ? await sendFireBaseNotification(title,body,imageUrl,deviceId) : null;
} 

export const sendFireBaseNotification = async (title,body,image,deviceId) => {
    let data = JSON.stringify({
    "to": deviceId,
    "notification": {
        "title": title,
        "body": body,
        "image": image
    },
    "priority": "high"
    });

    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `key=${FIREBASE_SERVER_KEY}`
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        // console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
}

export const getDeviceIdByCustomerId = async (customerId) => {
    let customer = await User.findById(customerId);
    return customer?.deviceId;
}

