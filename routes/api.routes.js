const fs = require('fs');
var service = require("../controllers/ServiceController");
const { check,body, validationResult } = require('express-validator');
const config = require('../config/config');
const multer  = require('multer');
const mimeType = ['image/jpg','image/jpeg','image/png','image/webp','image/svg+xml']; //File Type
var express = require('express');
const userValidation = require('../validation/userValidation');
var router = express.Router();

// const upload = multer({
//     storage:multer.diskStorage({
//         destination:function(req,file,cb){
//             console.log({...req.body});
//             // var filepath = 'public/uploads/'+req?.body?.path;
//             var filepath = 'public/uploads/vendor';
//             if (!fs.existsSync(filepath)){
//                 fs.mkdirSync(filepath);
//             }
            
//             cb(null,filepath);
//         },
//         filename:function(req,file,cb){
//             var extansion = file.mimetype.split("/")[1];
//             cb(null,file.fieldname+"-"+Date.now()+'.'+extansion);
//         }
//     }),
//     fileFilter: (req, file, cb) => {
//         var extansion = file.mimetype.split("/")[1];
//         if(mimeType.includes(extansion)){
//             cb(null, true);
//         }else{
//             cb(null, false);
//             req.file_error = "Image Format must be jpg, png, jpeg or webp!!";
//         }
//     }
// })
const upload = multer({limits: {fileSize: 1024 * 1024 * 5},fileFilter: (req, file, done) => {if (mimeType.includes(file.mimetype)) { done(null, true); } else {req.file_error = "Image Format must be jpg, png, jpeg or webp!!"; done(null, false);}}})

//Upload Files
// router.post('/upload',upload,(req,res)=>{
//     if(req.file_error != undefined && (req.file_error != null || req.file_error != '')){
//         var data = [];
//         data.errors = [{"msg":req.file_error,"param":"image","location":"body"}];
//         config.response(400,'Validation Error!',{ errors:data.errors },res);
//     }else{
//         config.UploadImage(req,res);
//     }
// });
router.post('/upload',
    upload.array('image'),
    userValidation.uploadImageValdator,
    config.UploadImage
);

// creattoken For Vendor
router.post('/creattoken',(req, res) =>{
    service.creatToken(req, res);
});
/*------------------------------api Vender-----------------------*/
 
router.get('/countries-list',service.countriesList);

router.post('/states-list',
    [
        body('countryId').not().isEmpty().withMessage("countryId field is required!"),
    ],
    userValidation.validation,
    service.statesList
);

router.post('/cities-list',
    [
        body('stateId').not().isEmpty().withMessage("stateId field is required!"),
    ],
    userValidation.validation,
    service.citiesList
);

router.post('/branch-list',
    [
        body('cityId').not().isEmpty().withMessage("cityId field is required!"),
    ],
    userValidation.validation,
    service.branchList
);

router.get('/service-type-list',service.serviceTypeList);


module.exports = router;
 