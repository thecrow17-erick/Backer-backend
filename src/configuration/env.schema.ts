import * as Joi from 'joi';
export const EnvSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(3001),
  SECRET_KEY_JWT: Joi.string().required(),
});
