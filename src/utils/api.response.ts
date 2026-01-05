import { Response } from "express";

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };

  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};
