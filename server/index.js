import express from "express";
import cors from "cors";
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
