import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate as classValidate } from "class-validator";

export function validate<T extends object>(dtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await classValidate(instance);

    if (errors.length > 0) {
      const formatted = errors.map((err) => ({
        field: err.property,
        messages: Object.values(err.constraints ?? {}),
      }));
      return res.status(400).json({ errors: formatted });
    }

    req.body = instance;
    next();
  };
}