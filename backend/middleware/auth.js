import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Protect da routes
export const protectRoutes=async (req,res,next) => {
    try {
        const token=req.headers.token;
        const decodedToken=jwt.verify(token, process.env.JWT_SECRET);
        const user=await User.findById(decodedToken.userId).select("-password");

        if(!user){
            return res.json({success: false, message: "User not found, please login again" });
        }
        req.user=user;next();
    } catch (err) {
        console.log(err.message);
        res.json({success: false, message: err.message });
    }
}