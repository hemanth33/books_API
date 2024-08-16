import User from '../models/userModel.js';

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.userType !== 'Admin') {
            return res.status(401).send({
                success: false,
                message: "Only Admin Access"
            });
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Unauthorized Access",
            error
        })
    }
}

export default adminMiddleware;