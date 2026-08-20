import { User } from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const Token_Expire = process.env.Token_Expire || "24h";

const createToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: Token_Expire });
}

//register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    // try {
    //     const user = new User({ name, email, password });
    //     await user.save();
    //     res.status(201).json({ 
    //         message: "User registered successfully" 
    //     });
    // } catch (error) {
    //     res.status(500).json({ message: 
    //         "Error registering user", error 
    //     });
    // }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 
            message: "Invalid email " 
        });
    }
    if(password.length < 6) {
        return res.status(400).json({ 
            message: "Password must be at least 6 characters long" 
        });
    }

    try{
        if(await User.findOne({ email })) { 
            return res.status(400).json({
                success: false,
                message: "User already exists" 
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } 
    catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Error checking user/ server error", error 
        });
    }
};

//to login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Please fill all the fields"   
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = createToken(user._id);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in user/ server error",
            error
        });
    }
};

//to get user details
export async function getUserDetails(req, res) {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error
        });
    }
};

//to update a user profile
export async function updateUserProfile(req, res) {
    const userId = req.userId;
    const { name, email, password } = req.body; 
    if (!name && !email && !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide at least one field to update"
        });
    }
    try{
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Update user fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating user profile",
            error
        });
    }
};

//to change user password
export async function changeUserPassword(req, res) {
    const {currentPassword, newPassword} = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password invalid or too short!"
        });
    }
    try {
        const user = await User.findById(req.userId).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error changing password",
            error
        });
    }
}