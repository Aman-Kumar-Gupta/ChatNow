import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


//For Sign Up
export const signUp =async (req,res) => {
    const { email, fullName, password, profilePic, bio } = req.body;
    try {
        //Validations
        if(!email || !fullName || !password) {
            return res.json({success: false, message: "Please fill all the fields" });
        }
        const user=await User.findOne({ email });

        if(user){
            return res.json({success: false, message: "Account with this email already exists!" });
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password, salt);
        //Create a new user
        const newUser=await User.create({
            email,
            fullName,
            password: hashedPassword,
            profilePic,
            bio
        });
        const token=generateToken(newUser._id);
        res.json({success: true, userData: newUser, token,message: "Account created successfully"  });
    } catch (err) {
        console.log(err.message);
         res.json({success: false, message: err.message });
    }
}

//For Login
export const login= async (req,res) => {
    try {
        const { email, password} = req.body;
        const userData=await User.findOne({ email });

        const isPasswordCorrect=await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect) {
            return res.json({success: false, message: "Invalid email or password" });
        }
        const token=generateToken(userData._id);
        res.json({success: true,userData,token, message: "Successfully logged in" });
    } catch (err) {
        console.log(err.message);
         res.json({success: false, message: err.message });
    }
}

//For Authentication of User
export const checkAuth= (req,res) => {
    res.json({success: true, user: req.user });
}

//For Updating User Profile
export const updateProfile= async (req,res) => {
    try {
        const {profilePic, bio, fullName}=req.body;
        const userId=req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser=await User.findByIdAndUpdate(userId, {
                bio,
                fullName
            }, {new: true});
        }else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updatedUser=await User.findByIdAndUpdate(userId,{profilePic: upload.secure_url,bio,fullName}, {new: true});
        }
        res.json({success:true, user:updatedUser});
    } catch (err) {
        console.log(err.message);
        res.json({success:false, message:err.message});
    }
}