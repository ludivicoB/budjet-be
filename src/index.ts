import dotenv from "dotenv";
dotenv.config();
import { createServer } from "./app";

const app = createServer();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  });
}

export default app;
