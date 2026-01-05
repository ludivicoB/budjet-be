import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface JwtPayload {
  user_id: string;
}

export const JwtUtils = {
  /**
   * Generate access token
   */
  generateAccessToken: (payload: JwtPayload): string => {
    return jwt.sign(
      payload,
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
  },

  /**
   * Verify and decode token
   */
  verifyToken: (token: string): JwtPayload => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string);
      return decoded as JwtPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  },

  /**
   * Decode token without verification (useful for debugging)
   */
  decodeToken: (token: string): JwtPayload | null => {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  },
};
