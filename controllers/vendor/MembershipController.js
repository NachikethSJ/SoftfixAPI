const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let membershipController = {};

membershipController.create = async (req,res) => {
    try {
        const result = await commonServices.create('memberships',{...req?.body,userId:req?.userId,created_by:"vendor"});
        if (result) {
            return config.response(200, 'Membership Created Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

membershipController.list = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`userId = ${req?.userId} and created_by = 'vendor'`;
        if(queryParams?.shopId) {
            query += ` and shopId = ${queryParams?.shopId}`;
        }
        if(queryParams?.serviceId) {
            query += ` and serviceId = ${queryParams?.serviceId}`;
        }
        if(queryParams?.subServiceId) {
            query += ` and subServiceId = ${queryParams?.subServiceId}`;
        }
        if(queryParams?.serviceTypeId) {
            query += ` and serviceTypeId LIKE '%${queryParams?.serviceTypeId}%'`;
        }
        if(queryParams?.membershipName) {
            query += ` and membershipName LIKE '%${queryParams?.membershipName}%' `;
        }
        const result = await commonServices.getByWhereCondition('memberships',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                datas.push({
                    ...r,
                    shopName:(await commonServices.getById('shops',r?.shopId))?.name,
                    serviceName:(await commonServices.getById('service',r?.serviceId))?.name,
                    subServiceName:(await commonServices.getById('sub_services',r?.subServiceId))?.type,
                    serviceTypeName:(await commonServices.getById('service_types',r?.serviceTypeId))?.name,
                    imageUrl:await config.getImageSingedUrlById(r?.file),
                });
            }
            return config.response(200, 'Membership list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

membershipController.update = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('memberships','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Membership Id!',{}, res);
        }
        let updateData = req?.body;
        let id = req?.body?.id;
        delete updateData['id'];
        delete updateData['shopName'];
        delete updateData['serviceName'];
        delete updateData['subServiceName'];
        delete updateData['serviceTypeName'];
        delete updateData['imageUrl'];
        const result = await commonServices.update('memberships',id,{...updateData});
        if (result) {
            return config.response(200, 'Membership has been updated Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

membershipController.delete = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('memberships','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Membership Id!',{}, res);
        }
        const result = await commonServices.update('memberships',req?.body?.id,{isDelete:1});
        if (result) {
            return config.response(200, 'Membership has been deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}
module.exports = membershipController;