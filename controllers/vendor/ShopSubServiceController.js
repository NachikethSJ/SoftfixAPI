const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let shopSubServiceController = {};

shopSubServiceController.create = async (req,res) => {
    try {
        const result = await commonServices.create('sub_services',{...req?.body,userId:req?.userId,created_by:"vendor"});
        if (result) {
            return config.response(200, 'Sub Service Created Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopSubServiceController.list = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`userId = ${req?.userId} and created_by = 'vendor'`;
        if(queryParams?.serviceId) {
            query += ` and serviceId = ${queryParams?.serviceId}`;
        }
        if(queryParams?.type) {
            query += ` and type LIKE '%${queryParams?.type}%'`;
        }
        const result = await commonServices.getByWhereCondition('sub_services',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                datas.push({
                    ...r,
                    serviceName:(await commonServices.getById('service',r?.serviceId))?.name,
                    imageUrl:await config.getImageSingedUrlById(r?.file)
                });
            }
            return config.response(200, 'Sub Service list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopSubServiceController.update = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('sub_services','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Service Id!',{}, res);
        }
        let updateData = req?.body;
        let id = req?.body?.id;
        delete updateData['id'];
        delete updateData['serviceName'];
        delete updateData['imageUrl'];
        const result = await commonServices.update('sub_services',id,updateData);
        if (result) {
            return config.response(200, 'Sub Service updated Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopSubServiceController.delete = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('sub_services','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Service Id!',{}, res);
        }
        const result = await commonServices.update('sub_services',req?.body?.id,{isDelete:1});
        if (result) {
            return config.response(200, 'Sub Service deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}
module.exports = shopSubServiceController;