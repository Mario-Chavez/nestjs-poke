import * as joi from 'joi';

/* el joi es como unas validacione que se hace a los .env para que no vengan vacio y 
si vienen vacio le setea un valor por defecto */

export const JoiValidationSchema = joi.object({
  MONGODB: joi.required(),
  PORT: joi.number().default(3005),
  DEFAULT_LIMIT: joi.number().default(6),
});
