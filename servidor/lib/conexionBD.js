var mysql = require('mysql');

var conexion = mysql.createConnection({
  host     : '0.0.0.0',
  port     : '3306',
  user     : 'root',
  password : 'Azu1991',
  database : 'competencias',
});


module.exports = conexion;

