import express from "express";
import "dotenv/config.js";
import morgan from "morgan";
import connectDB from "./config/db.js";
import helmetMiddleware from "./middlewares/helmetMiddleware.js";

const PORT = process.env.PORT;
// dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(helmetMiddleware);

app.get("/health", async (_req, res) => {
  return res.status(200).json({ ok: true });
});

try {
  app.listen(process.env.PORT, () => {
    console.clear();
    connectDB();
    console.log(`The server is running on the Port ${PORT}`);
  });
} catch (error) {
  console.error("Server startup failed", error);
}
