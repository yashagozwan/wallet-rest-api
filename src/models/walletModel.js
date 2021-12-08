import Joi from 'joi';

//* generate walletAddress
export const generateWalletAddress = () =>
  `${Math.ceil(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}${Math.floor(
    Math.random() * 9
  )}${Math.floor(Math.random() * 9)}`;

export const walletAddressAndAmountVaidate = Joi.object({
  walletAddress: Joi.number().required(),
  amount: Joi.number().min(1000).required(),
});
