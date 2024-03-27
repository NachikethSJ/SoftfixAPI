const db =require("../db/connection");
const util = require('util');
const queryAsync = util.promisify(db.query).bind(db);

class commonServices {
    static async create(table,data) {
        try {
            const result = await queryAsync(`INSERT INTO ${table} SET ?`, data);
            return result;   
        } catch (error) {
            throw error;
        }
    }

    static async getById(table, id){
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE id = ?`, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    };

    static async getByIdMultiple(table, id){
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE id IN (?)`, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    };

    static async getByCustomField(table, field, value){
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE ${field} = ? `, [value]);
            return result[0];
        } catch (error) {
            throw error;
        }
    };

    static async getByCustomFieldWithNotEqualCustomField(table, field, value, field2, value2){
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE ${field} = ? AND ${field2} != ?`, [value,value2]);
            return result[0];
        } catch (error) {
            throw error;
        }
    };

    static async getByCustomFieldMultiple(table, field, value) {
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE ${field} = ? and isDelete !=1`, [value]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getByCustom2Field(table, field, value,field2, value2) {
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE ${field} = ? and ${field2} = ? and isDelete !=1`, [value,value2]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getByCustom3Field(table, field, value,field2, value2,field3,value3) {
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE ${field} = ? and ${field2} = ? and ${field3} = ? and isDelete !=1`, [value,value2,value3]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getByWhereCondition(table, where) {
        try {
            const result = await queryAsync(`SELECT * FROM ${table} WHERE ${where} and isDelete !=1`);
            return result;
        } catch (error) {
            throw error;
        }
    }

//   static async getByUserName(table,userName) {
//     const [data] = await db.query(`SELECT * FROM ${table} WHERE user_name = ?`, [userName]);
//     console.log(data, 'service');
//     return data[0];
//   }

  static async getAll(table) {
    const data = await queryAsync(`SELECT * FROM ${table} WHERE isDelete != 1`);
    return data;
  }

  static async update(table, id, userData) {
    const result = await queryAsync(`UPDATE ${table} SET ? WHERE id = ?`, [userData, id]);
    return result;
  }
  
  static async getLatestData(table) {
    const result = await queryAsync(`SELECT * FROM ${table} ORDER BY  created_at DESC LIMIT 1`);
    return result?.[0];
  }


  // NEW FUNCTIONS START


  static async getByCustomFieldSingle(table, field, value) {
    try {
        const result = await queryAsync(`SELECT * FROM ${table} WHERE ${field} = ? and isDelete !=1`, [value]);
        return result[0];
    } catch (error) {
        throw error;
    }
}


  // NEW FUNCTIONS END

}

module.exports = commonServices;
