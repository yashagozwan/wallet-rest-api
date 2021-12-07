import Joi from 'joi';
import bcrypt from 'bcrypt';

export const emailAndPasswordValidate = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const compare = async (password, encryptPassword) => {
  return await bcrypt.compare(password, encryptPassword);
};
