import {User} from "../models/userModel.js";
// import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
        success: false,
        message: "Authorization header missing or invalid" 
    });
  }

    const token = authHeader.split(" ")[1];

    //to verify the token
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.userId).select("-password"); // Exclude password from the user object
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found" 
            });
        }
        req.user = user;
        req.userId = user._id;
        next();
    } 
    catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).json({ 
            success: false,
            message: "Invalid token or expired" 
        });
    }

}
