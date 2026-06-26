import { auth } from "../config/firebaseAdmin.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Invalid or expired token" });
  }
};

export default verifyToken;
