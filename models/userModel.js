import mongoose from "mongoose";

const userTypeEnum = ["Client", "Admin"];

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide Full Name.'],
    },
    userName: {
        type: String,
        required: [true, 'Please provide Username.'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide Password'],
    },
    favoriteBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        },
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        },
    ],
    userType: {
        type: String,
        enum: userTypeEnum,
        default: "Client",
    },
},
    {timestamps: true}
);

const User = mongoose.model('User', userSchema);
export default User;