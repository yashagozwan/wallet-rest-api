import moment from 'moment';

import promisePool from '../database/promisePool.js';
import {
  userValidate,
  hash,
  lowerCase,
  capitalize,
} from '../models/userModel.js';

moment.locale('id');

//* METHOD POST
//* CREATE USER
//* URL: /users
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = await userValidate.validateAsync(
      req.body
    );

    const [findDuplicate] = await promisePool.query(
      'SELECT * FROM Users WHERE email = ?',
      [lowerCase(email)]
    );

    if (findDuplicate.length)
      return res
        .status(400)
        .json({ success: false, error: 'email already exist' });

    const [user] = await promisePool.query(
      'INSERT INTO Users(name, email, password) VALUES (?, ?, ?)',
      [capitalize(name), lowerCase(email), await hash(password)]
    );

    const [role] = await promisePool.query(
      'INSERT INTO UserRoles(userId) VALUES (?)',
      [user.insertId]
    );

    if (user.affectedRows && role.affectedRows)
      res.status(201).json({ success: true, status: 'account created' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//* METHOD GET
//* CREATE USER
//* URL: /users
export const getUsers = async (req, res) => {
  try {
    const [users] = await promisePool.query('SELECT * FROM Users');
    const data = users.map((user) => ({
      ...user,
      modify: user.modify && moment(user.modify).fromNow(),
      createdAt: user.createdAt && moment(user.createdAt).format('LL'),
    }));

    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

//* METHOD GET
//* CREATE USER
//* URL: /users/id
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const [user] = await promisePool.query('SELECT * FROM Users WHERE id = ?', [
      id,
    ]);

    if (!user.length)
      return res.status(404).json({ success: false, error: 'invalid id' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  try {
    const [rows] = await promisePool.query(
      'UPDATE Users SET name = ?, email = ?, password = ? WHERE id = ?',
      [capitalize(name), lowerCase(email), await hash(password), id]
    );

    res
      .status(200)
      .json({ success: true, status: rows.affectedRows && 'updated' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
