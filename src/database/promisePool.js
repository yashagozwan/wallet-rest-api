import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const promisePool = pool.promise();

export default promisePool;
