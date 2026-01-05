import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase.client";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ message: "Invalid token" });

  // attach user to request
  (req as any).user = user.user;
  next();
};
