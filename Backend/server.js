import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js";

const required = ["MONGO_URI", "JWT_SECRET", "BREVO_API_KEY", "SENDER_EMAIL"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("❌ Missing required env vars:", missing.join(", "));
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, service: "coy-discover-api" }));
app.use("/", userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is Running on :  http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed", err);
    process.exit(1);
  });
