import express from "express";
import "dotenv/config.js";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from 'cors'
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.routes.js'
import meRoutes from './routes/me.routes.js'

const PORT = process.env.PORT;
// dotenv.config();
const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

app.get("/api/health", async (_req, res) => {
  return res.status(200).json({ ok: true });
});

app.use('/api/auth', authRoutes)
app.use('/api/me', meRoutes)

try {
  connectDB();
  app.listen(process.env.PORT, () => {
    console.clear();
    console.log(`The server is running on the Port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed", error);
}
