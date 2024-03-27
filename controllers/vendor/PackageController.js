const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let packageController = {};

packageController.create = async (req,res) => {
    try {
        const result = await commonServices.create('packages',{...req?.body,serviceId:JSON.stringify(req?.body?.serviceId),userId:req?.userId,created_by:"vendor"});
        if (result) {
            return config.response(200, 'Package Created Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

packageController.list = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`userId = ${req?.userId} and created_by = 'vendor'`;
        if(queryParams?.shopId) {
            query += ` and shopId = ${queryParams?.shopId}`;
        }
        // if(queryParams?.serviceId) {
        //     query += ` and serviceId = ${queryParams?.serviceId}`;
        // }
        if(queryParams?.packageName) {
            query += ` and packageName LIKE '%${queryParams?.packageName}%' `;
        }
        const result = await commonServices.getByWhereCondition('packages',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                let serviceSubServices = JSON.parse(r?.serviceId);
                let serviceIdData = [];
                for(let subservice of serviceSubServices) {
                    let serviceName = await commonServices.getByIdMultiple('service',subservice?.id);
                    let subserviceName = await commonServices.getByIdMultiple('sub_services',(subservice?.subServiceId.split(",")));
                    serviceIdData.push({serviceName,subserviceName});
                }
                datas.push({
                    ...r,
                    shopName:(await commonServices.getById('shops',r?.shopId))?.name,
                    imageUrl:await config.getImageSingedUrlById(r?.file),
                    serviceIdData
                });
            }
            return config.response(200, 'Package list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

packageController.update = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('packages','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Package Id!',{}, res);
        }
        let updateData = req?.body;
        let id = req?.body?.id;
        delete updateData['id'];
        delete updateData['shopName'];
        delete updateData['imageUrl'];
        delete updateData['serviceIdData'];
        const result = await commonServices.update('packages',id,{...updateData,serviceId:JSON.stringify(req?.body?.serviceId)});
        if (result) {
            return config.response(200, 'Package has been updated Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

packageController.delete = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('packages','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Package Id!',{}, res);
        }
        const result = await commonServices.update('packages',req?.body?.id,{isDelete:1});
        if (result) {
            return config.response(200, 'Package has been deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}
module.exports = packageController;