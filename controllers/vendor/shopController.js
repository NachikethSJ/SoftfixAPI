const shopController = {};
const db =require("../../db/connection");
const config = require('../../config/config');
const errorLog = require('../../config/logger');
const commonServices = require('../../servicves/commonServices');
const jwt = require('jsonwebtoken');

shopController.create = async (req, res) => {
    try {
        // const { branchName, shopName, mobile, lat, lng, description, gstNo, tinNo, panNo, aadhaar, address, pin, country, state, city } = req?.body;
        let shopId = await config.createShopId();
        const result = await commonServices.create('shops',{...req?.body,vendorId:req?.userId,shopId:shopId});
        if (result) {
            return config.response(200, 'Shop Created Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopController.list = async (req, res) => {
    try {
        const result = await commonServices.getByCustomFieldMultiple('shops','vendorId',req?.userId);
        if (result) {
            let datas = [];
            for(let r of result) {
                datas.push({
                    ...r,
                    countryName:(await commonServices.getById('country',r?.country))?.name,
                    stateName:(await commonServices.getById('state',r?.state))?.name,
                    cityName:(await commonServices.getById('state',r?.city))?.name,
                    branchName:(await commonServices.getById('branch',r?.branchId))?.name,
                    imageUrl:await config.getImageSingedUrlById(r?.file),
                });
            }
            return config.response(200, 'Shop list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopController.update = async (req, res) => {
    try {
        let checkExists = await commonServices.getByCustom2Field('shops','vendorId',req?.userId,'id',req?.body?.id);
        if(!checkExists) {
            return config.response(201, 'Invalid shop Id!',{}, res);
        }
        let updateData = req?.body;
        let id = req?.body?.id;
        delete updateData['id'];
        delete updateData['countryName'];
        delete updateData['stateName'];
        delete updateData['cityName'];
        delete updateData['branchName'];
        delete updateData['imageUrl'];
        const result = await commonServices.update('shops',id,updateData);
        if (result) {
            return config.response(200, 'Shop updated Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopController.delete = async (req, res) => {
    try {
        let checkExists = await commonServices.getByCustom2Field('shops','vendorId',req?.userId,'id',req?.body?.id);
        if(!checkExists) {
            return config.response(201, 'Invalid shop Id!',{}, res);
        }
        const result = await commonServices.update('shops',req?.body?.id,{isDelete:1});
        if (result) {
            return config.response(200, 'Shop deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}
module.exports = shopController;