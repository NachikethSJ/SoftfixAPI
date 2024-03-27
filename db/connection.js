const mysql = require('mysql');
// var mysqlConnection = mysql.createConnection({
// host: 'localhost',
// user: 'root',
// password: 'Charry@123',
// database: 'charry_saloon',
// strict : false,
// multipleStatements: true
// });
var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'charry_saloon',
  strict: false,
  multipleStatements: true
});
mysqlConnection.connect((err) => {
  if (!err)
    console.log('Connection Established Successfully');
  else
    console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});
mysqlConnection.query('SET sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""));', (err, results) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('ONLY_FULL_GROUP_BY mode disabled for current session');
});

module.exports = mysqlConnection;