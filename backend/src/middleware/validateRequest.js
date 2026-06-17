import { ZodError } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.validated = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const error = new Error('Invalid request body');
        error.status = 400;
        error.details = err.flatten().fieldErrors;
        return next(error);
      }
      next(err);
    }
  };
}