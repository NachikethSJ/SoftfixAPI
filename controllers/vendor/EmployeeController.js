const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let employeeController = {};

employeeController.create = async (req,res) => {
    try {
        const result = await commonServices.create('employee',{
            ...req?.body,
            userId:req?.userId,
            pPassword:req?.body?.password,
            password:await config.hashPassword(req?.body?.password),
            employId:await config.createEmployeeId(),
            created_by:"vendor"
        });
        if (result) {
            return config.response(200, 'Employee Created Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

employeeController.list = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`userId = ${req?.userId} and created_by = 'vendor'`;
        if(queryParams?.shopId) {
            query += ` and shopId LIKE '%${queryParams?.shopId}%'`;
        }
        if(queryParams?.serviceTypeId) {
            query += ` and serviceTypeId LIKE '%${queryParams?.serviceTypeId}%'`;
        }
        if(queryParams?.employName) {
            query += ` and employName LIKE '%${queryParams?.employName}%' `;
        }
        if(queryParams?.employId) {
            query += ` and employId LIKE '%${queryParams?.employId}%' `;
        }
        const result = await commonServices.getByWhereCondition('employee',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                datas.push({
                    ...r,
                    shopData:(await commonServices.getByIdMultiple('shops',r?.shopId?.split(","))),
                    serviceTypeName:(await commonServices.getById('service_types',r?.serviceTypeId))?.name,
                    imageUrl:(r?.file) ? await config.getImageSingedUrlById(r?.file) : '',
                });
            }
            return config.response(200, 'Employee list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

employeeController.update = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('employee','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Employee Id!',{}, res);
        }
        let updateData = req?.body;
        let id = req?.body?.id;
        let password = (req?.body?.password) ? {password: await config.hashPassword(req?.body?.password),pPassword:req?.body?.password}: {};
        delete updateData['id'];
        delete updateData['shopData'];
        delete updateData['serviceTypeName'];
        delete updateData['imageUrl'];
        delete updateData['password'];
        const result = await commonServices.update('employee',id,{...updateData,...password});
        if (result) {
            return config.response(200, 'Employee has been updated Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

employeeController.delete = async (req, res) => {
    try {
        const checkExists = await commonServices.getByCustom3Field('employee','userId',req?.userId,'id',req?.body?.id,'created_by','vendor');
        if(!checkExists) {
            return config.response(201, 'Invalid Employee Id!',{}, res);
        }
        const result = await commonServices.update('employee',req?.body?.id,{isDelete:1});
        if (result) {
            return config.response(200, 'Employee has been deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}
module.exports = employeeController;