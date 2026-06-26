import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attendanceRoutes from "../server/src/routes/attendance.routes.js";
import adminRoutes from "../server/src/routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/attendance", attendanceRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "HCM Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
