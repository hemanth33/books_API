import JWT from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = await req.cookies.jwt;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access",
            });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).send({
                success: false,
                message: "Invalid Token",
            });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;

        next();


    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in Authorization",
            error: error.message,
        });
    }
};

export default authMiddleware;