import { Request, Response, NextFunction } from 'express';
import { BaseError } from '@utils/errors';
import { config } from '@src/config';
import { ZodError } from 'zod';

export const errorCatcher = (
  err: Record<string, unknown>,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response<unknown, Record<string, unknown>> => {
  logger.error({
    error: {
      type: err.name,
      message: err.message,
      code: err.code,
      success: false,
      stack: err.stack,
    },
  });
  if (err instanceof BaseError)
    return config.ENVIRONMENT === 'development'
      ? res.status(err.code).json({
          error: {
            type: err.name,
            message: err.message,
            code: err.code,
            success: false,
            stack: err.stack,
          },
        })
      : res.status(err.code).json({ error: { name: err.name, message: err.message } });
  if (err instanceof ZodError)
    return config.ENVIRONMENT === 'development'
      ? res
          .status(400)
          .json({
            error: {
              name: err.name,
              message: err.message,
              errors: err.errors,
              formErrors: err.formErrors,
            },
          })
      : res.status(400).json({ error: { name: err.name, message: err.message } });
  return res.status(500).send();
};

export const handleErrorAsync =
  (func: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
