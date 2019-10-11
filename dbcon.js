var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs290_croome',
  password        : '0616',
  database        : 'cs290_croome'
});

module.exports.pool = pool;
