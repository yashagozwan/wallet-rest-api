import jwt from 'jsonwebtoken';

import promisePool from '../database/promisePool.js';
import { compare, emailAndPasswordValidate } from '../models/authModel.js';

export const signIn = async (req, res) => {
  try {
    const { email, password } = await emailAndPasswordValidate.validateAsync(
      req.body
    );

    const [user] = await promisePool.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (!user.length || !(await compare(password, user[0].password)))
      return res
        .status(404)
        .json({ success: false, error: 'incorrect email or password' });

    const token = jwt.sign({ userId: user[0].id }, process.env.KEY);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
