const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let shopController = {};

shopController.list = async (req, res) => {
    try {
        const userData = await commonServices.getById('employee',req?.userId);
        const result = await commonServices.getByIdMultiple('shops',userData?.shopId?.split(","));
        if (result) {
            return config.response(200, 'Shop list get Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

shopController.serviceList = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`name !=''`;
        if(queryParams?.shopId) {
            query += ` and shopId = ${queryParams.shopId}`;
        }
        if(queryParams?.serviceTypeId) {
            query += ` and serviceTypeId LIKE '%${queryParams.serviceTypeId}%'`;
        }
        const result = await commonServices.getByWhereCondition('service',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                let subServiceQuery = `serviceId=${r?.id} and status=1`;
                let subServices = await commonServices.getByWhereCondition('sub_services',subServiceQuery);
                if(subServices.length > 0) {
                    datas.push({
                        ...r,
                        subServices:subServices
                    });
                }
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

shopController.updateService = async (req,res) => {
    try {
        let result = await commonServices.getByCustom2Field('employee_services','userId',req?.userId,'shopId',req?.body?.shopId);
        result = result?.[0];
        if(req?.body?.type=='set') {
            if(!(req?.body?.service) || req?.body?.service?.length == 0){
                return config.response(201, 'Service Field is required!', {}, res);
            }
            if(result){
                const updateService = await commonServices.update('employee_services',result?.id,{
                    services:JSON.stringify(req?.body?.service),
                    shopId:req?.body?.shopId,
                    status:1
                });
                return config.response(201, 'Service has been updated Successfully!', updateService, res);
            } else {
                const saveService = await commonServices.create('employee_services',{
                    userId:req?.userId,
                    services:JSON.stringify(req?.body?.service),
                    shopId:req?.body?.shopId,
                    status:1
                });
                return config.response(200, 'Service has been updated Successfully!', saveService, res);
            }
        } else {
            if(result){
                return config.response(200, 'Services get Successfully!', {services:JSON.parse(result?.services)}, res);
            } else {
                return config.response(201, 'No Data Available!', {}, res);
            }
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
} 

module.exports = shopController;