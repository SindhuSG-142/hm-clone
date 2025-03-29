import jwt from "jsonwebtoken";
import blacklist from "../blacklistToken.js";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ message: "You are not authorised." });
    }
    if (blacklist.includes(token)) {
      return res.status(200).json({ message: "You have signed out. Please login" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).json({ message: "Error while verifying token" });
      }
      req.body.role = decoded.role;
      req.body.user_id = decoded._id;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export default auth;
