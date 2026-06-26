import { db } from "../config/firebaseAdmin.js";

const requireAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return res.status(401).json({ error: "Admin access is required" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: "Failed to verify admin role" });
  }
};

export default requireAdmin;
