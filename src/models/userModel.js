import Joi from 'joi';
import bcrypt from 'bcrypt';

export const userValidate = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

export const hash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const lowerCase = (email) => email.toLowerCase();

export const capitalize = (text) => {
  let capital = text.split(' ');
  capital = capital.map((t) => t[0].toUpperCase() + t.slice(1).toLowerCase());

  return capital.join(' ');
};
