import jwt from 'jsonwebtoken';

import promisePool from '../database/promisePool.js';

export default (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ success: false, error: 'unauthorization' });

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.KEY, async (error, payload) => {
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
