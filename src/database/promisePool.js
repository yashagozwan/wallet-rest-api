import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'b6qhwtcq2mct5p4y8khb-mysql.services.clever-cloud.com',
  port: '3306',
  user: 'uf0uive1x7qiw1qu',
  password: 'DAWRYuhqwpMkbFzPr36p',
  database: 'b6qhwtcq2mct5p4y8khb',
});

const promisePool = pool.promise();

export default promisePool;
