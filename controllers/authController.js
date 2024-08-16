import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSendCookie from '../utils/generateToken.js'

export const signUpController = async (req, res) => {
    try {

        const { fullName, userName, email, password, confirmPassword, userType } = req.body;

        // 1. Check if all the fields are provided.
        if(!fullName || !userName || !email || !password || !confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Please provide all the fields.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Passwords don't match."
            });
        }

        if (password.length < 8) {
            return res.status(400).send({
                success: false,
                message: "Password should be minimum 8 characters."
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already exists, Please Login",
            });
        }

        // 3. Password Hashing
        const salt = await bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hashSync(password, salt);

        // 4. Save User in the database
        const user = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
            userType: userType || 'Client',
        });

        if (user) {

            generateTokenAndSendCookie(user._id, res);
            await user.save();

            user.password = undefined;

            res.status(201).send({
                success: true,
                message: "User created successfully",
                _id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email,
            });
        }

    } catch (error) {
        res.status(500).send({
            success: true,
            message: "Error in Sign Up API",
            error: error.message,
        });
    }
}

export const logInController = async (req, res) => {
    try {

        const { email, password } = req.body;

        // 1. Check if all fields are provided
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide all the fields"
            });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });

        // 3. Compare password
        const isPassword = await bcryptjs.compareSync(password, user?.password || "");

        
        if(!user || !isPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid Credentials",
            });
        }

        // 3. Generate token and send response
        generateTokenAndSendCookie(user._id, res);

        res.status(200).send({
            success: true,
            message: "User logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
        });
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Login API",
            error: error.message,
        });
    }
}

export const logOutController = async (req, res) => {
    try {

        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).send({
            success: true,
            message: "User Logged out successfully",
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Logout API",
            error: error.message,
        });
    }
}

