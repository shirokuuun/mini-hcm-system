import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./src/config/firebaseAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const testRef = await db.collection("users").limit(1).get();
    res.json({
      message: "HCM System is running",
      firebase: "Connected.",
      docsFound: testRef.size,
    });
  } catch (error) {
    res.status(500).json({
      message: "Firebase connection failed.",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
