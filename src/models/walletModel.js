import Joi from 'joi';
import promisePool from '../database/promisePool.js';

//* generate walletAddress
export const generateWalletAddress = () =>
  `${Math.ceil(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}`;

//* validation
export const walletAddressAndAmountVaidate = Joi.object({
  walletAddress: Joi.number().required(),
  amount: Joi.number().min(1000).required(),
});

export const walletAddressValidate = Joi.object({
  walletAddress: Joi.number().required(),
});

//* method query
export const findWalletByUserId = async (userId) => {
  const [wallet] = await promisePool.query(
    'SELECT * FROM Wallets WHERE userId = ?',
    [userId]
  );

  return wallet[0];
};

export const findWalletByWalletAddress = async (walletAddress) => {
  const [wallet] = await promisePool.query(
    'SELECT * FROM Wallets WHERE walletAddress = ?',
    [walletAddress]
  );

  return wallet[0];
};
