import express, { Application, Request, Response } from "express";
import testRoutes from "./routes/test.route";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import cors from "cors";

export const createServer = (): Application => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "Express + Supabase API",
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  });

  // Routes
  app.use("/api/test", testRoutes);
  app.use("/api/auth", authRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
