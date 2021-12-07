import jwt from 'jsonwebtoken';

import promisePool from '../database/promisePool.js';
import { KEY } from '../config/init.js';

export default (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ success: false, error: 'unauthorization' });

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, KEY, async (error, payload) => {
    if (error)
      return res.status(401).json({ success: false, error: 'unauthorization' });

    const { userId: id } = payload;
    const [user] = await promisePool.query('SELECT * FROM Users WHERE id = ?', [
      id,
    ]);

    req.account = user[0];
    next();
  });
};
