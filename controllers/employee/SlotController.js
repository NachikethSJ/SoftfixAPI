const config = require("../../config/config");
const errorLog = require("../../config/logger");
const commonServices = require("../../servicves/commonServices");
const url = require('url');
const querystring = require('querystring');

let slotController = {};

slotController.conditionCheck = async (req, res) => {
    try {
        const result = await commonServices.getById('employee',req?.userId);
        if (result) {
            return config.response(200, 'Condition Chceked Successfully!', {isSlotAdd:((result?.serviceTypeId?.includes('1')) ? true : false )}, res);
        } else {
            return config.response(201, 'No User Found!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}


slotController.create = async (req, res) => {
    try {
        let checkWithRangeCondituion = await slotController.checkExists(req?.userId,req?.body?.dates,req?.body?.startTime,req?.body?.endTime);
        if(checkWithRangeCondituion?.checkCondition) {
            const result = await commonServices.create('employee_slots',{...req?.body,empId:req?.userId,dates:JSON.stringify(req?.body?.dates)});
            if (result) {
                return config.response(200, 'Slot Added Successfully!', result, res);
            } else {
                return config.response(201, 'Something went Wrong!',{}, res);
            }
        } else {
            return config.response(201,checkWithRangeCondituion?.checkConditionDate, {}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

slotController.list = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        let query =`empId = ${req?.userId}`;
        if(queryParams?.shopId) {
            query += ` and shopId = ${queryParams?.shopId}`;
        }
        const result = await commonServices.getByWhereCondition('employee_slots',query);
        if (result) {
            let datas = [];
            for(let r of result) {
                datas.push({
                    ...r,
                    dates:JSON.parse(r?.dates),
                    shopName:(await commonServices.getById('shops',r?.shopId))?.name,
                });
            }
            return config.response(200, 'Slot list get Successfully!', datas, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

slotController.update = async (req, res) => {
    try {
        let checkExists = await commonServices.getByCustom2Field('employee_slots','empId',req?.userId,'id',req?.body?.id);
        if(!checkExists) {
            return config.response(201, 'Invalid Slot Id!',{}, res);
        }
        let checkWithRangeCondituion = await slotController.checkExists(req?.userId,req?.body?.dates,req?.body?.startTime,req?.body?.endTime,req?.body?.id);
        if(checkWithRangeCondituion?.checkCondition) {
            let updateData = req?.body;
            let id = req?.body?.id;
            delete updateData['id'];
            delete updateData['shopName'];
            const result = await commonServices.update('employee_slots',id,{...updateData,dates:JSON.stringify(req?.body?.dates)});
            if (result) {
                return config.response(200, 'Slot updated Successfully!', result, res);
            } else {
                return config.response(201, 'Something went Wrong!',{}, res);
            }
        } else {
            return config.response(201,checkWithRangeCondituion?.checkConditionDate, {}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

slotController.delete = async (req, res) => {
    try {
        let checkExists = await commonServices.getByCustom2Field('employee_slots','empId',req?.userId,'id',req?.body?.id);
        if(!checkExists) {
            return config.response(201, 'Invalid Slot Id!',{}, res);
        }
        const result = await commonServices.update('employee_slots',req?.body?.id,{isDelete:1,deleted_at:new Date()});
        if (result) {
            return config.response(200, 'Slot deleted Successfully!', result, res);
        } else {
            return config.response(201, 'Something went Wrong!',{}, res);
        }
    } catch (error) {
        errorLog(error);
        return config.response(201, 'Something went Wrong!', { error }, res);
    }
}

slotController.checkExists = async (userId,dates,startTime,endTime,id=null) => {
    let checkCondition = true;
    let checkConditionDate = '';
    for(let date of dates) {
        if(checkCondition) {
            let query =`empId = ${userId} and dates LIKE '%${date}%'`;
            if(id != null) {
                query += ` and id !=${id}`;
            }
            let dateCheck = await commonServices.getByWhereCondition('employee_slots',query);
            for (let checkingWithTime of dateCheck){
                let startTiming1 = new Date(date+" "+startTime+":00");
                let endTiming1 = new Date(date+" "+endTime+":00");
                let startTiming2 = new Date(date+" "+checkingWithTime?.startTime+":00");
                let endTiming2 = new Date(date+" "+checkingWithTime?.endTime+":00");
                // console.log(startTiming1 >= endTiming2,startTiming1 , endTiming2);
                let checkConditionTime = await config.isCurrentTimeInRange(date,startTiming1,endTiming1,startTiming2,endTiming2);
                if (checkCondition && checkConditionTime) {
                    checkCondition = false;
                    checkConditionDate = date+" with slot "+startTime+" to "+endTime+" is already in exist";
                    break;
                }
            }
        }
    }
    return {checkCondition,checkConditionDate};
};

module.exports = slotController;