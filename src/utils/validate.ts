import { BadRequestError } from "../middlewares/error.middleware";

export const requireFields = (body: Record<string, any>, fields: string[]) => {
  const missing = fields.filter((field) => !body[field]);

  if (missing.length > 0) {
    throw new BadRequestError(`Missing required fields: ${missing.join(", ")}`);
  }
};

export const allowedFields = (body: Record<string, any>, fields: string[]) => {
  const invalid = Object.keys(body).filter((key) => !fields.includes(key));

  if (invalid.length > 0) {
    throw new BadRequestError(`Invalid fields: ${invalid.join(", ")}`);
  }
};
