import { BadRequestError } from "../middlewares/error.middleware";

export const requireFields = (body: Record<string, any>, fields: string[]) => {
  const missing = fields.filter((field) => !body[field]);

  if (missing.length > 0) {
    throw new BadRequestError(`Missing required fields: ${missing.join(", ")}`);
  }
};
