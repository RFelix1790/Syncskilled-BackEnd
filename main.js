import express from "express";
import "dotenv/config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import meRoutes from "./routes/me.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import postRoutes from "./routes/posts.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import helmetMiddleware from "./middlewares/helmetMiddleware.js";

const PORT = process.env.PORT;
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(helmetMiddleware);

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/api/health", async (_req, res) => {
  return res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api", categoryRoutes);
app.use("/api", skillsRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

try {
  connectDB();
  app.listen(process.env.PORT, () => {
    console.clear();
    console.log(`The server is running on the Port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed", error);
}
