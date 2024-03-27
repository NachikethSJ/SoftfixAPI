const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let shopServiceController = {};

shopServiceController.create = async (req,res) => {
    try {
        const result = await commonServices.create('service',{...req?.body,userId:req?.userId,created_by:"vendor"});
        if (result) {
            return config.response(200, 'Service Created Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopServiceController.list = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`userId = ${req?.userId} and created_by = 'vendor'`;
        if(queryParams?.shopId) {
            query += ` and shopId = ${queryParams.shopId}`;
        }
        if(queryParams?.serviceTypeId) {
            query += ` and serviceTypeId LIKE '%${queryParams.serviceTypeId}%'`;
        }
        if(queryParams?.name) {
            query += ` and name LIKE '%${queryParams.name}%'`;
        }
        const result = await commonServices.getByWhereCondition('service',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                let serviceType = r?.serviceTypeId;
                datas.push({
                    ...r,
                    shopName:(await commonServices.getById('shops',r?.shopId))?.name,
                    serviceTypeData:(await commonServices.getByIdMultiple('service_types',serviceType?.split(",")))
                });
            }
            return config.response(200, 'Service list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopServiceController.update = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('service','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Service Id!',{}, res);
        }
        let updateData = req?.body;
        let id = req?.body?.id;
        delete updateData['id'];
        delete updateData['shopName'];
        delete updateData['serviceTypeData'];
        const result = await commonServices.update('service',id,updateData);
        if (result) {
            return config.response(200, 'Service updated Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopServiceController.delete = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('service','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Service Id!',{}, res);
        }
        const result = await commonServices.update('service',req?.body?.id,{isDelete:1});
        if (result) {
            return config.response(200, 'Service deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}
module.exports = shopServiceController;