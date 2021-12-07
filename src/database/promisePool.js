import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'playground',
});

const promisePool = pool.promise();

export default promisePool;
