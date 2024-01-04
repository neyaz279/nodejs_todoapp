import { User } from "../models/users.js";
import bcrypt from 'bcrypt';
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            success: true,
            users: users
        });
    } catch (error) {
        // console.error("Error fetching all users:", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const getUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        // console.error('Error fetching user by email:', error);
        // res.status(500).json({
        //     success: false,
        //     message: 'Internal Server Error'
        // });
        next(error);
    }
};

export const getMyProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        // console.error("Error fetching user details:", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const createNewUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) return next(new ErrorHandler("User already exists", 400));

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        sendCookie(newUser, res, "Registered Successfully", 201);

    } catch (error) {
        // console.error("Error creating new user:", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) return next(new ErrorHandler("This Email Is Not Registered", 404));

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email or Password"
            });
        };

        sendCookie(existingUser, res, `Welcome back, ${existingUser.name}`, 200);
    } catch (error) {
        // console.error("Error while logging in:", error);
        // res.status(500).json({
        //     success: false,
        //     message: "Internal Server Error"
        // });
        next(error);
    }
};

export const logoutUser = (req, res) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        })
        .json({
            success: true,
            user: req.user,
        });
};