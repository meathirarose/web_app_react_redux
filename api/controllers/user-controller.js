import User from '../models/user-model.js'
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json({
        message : "api is working"
    }); 
}

// update user


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can't update another user's account."));
    }

    const { username, email, password, profilePicture } = req.body;
    const trimmedUsername = username ? username.trim() : '';
    const trimmedEmail = email ? email.trim() : '';
    const trimmedPassword = password ? password.trim() : '';

    if (!trimmedUsername || !trimmedEmail || !profilePicture) {
        return res.status(400).json({ success: false, message: 'Username, email, and profile picture are required.' });
    }

    if (trimmedUsername.length < 3) {
        return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long.' });
    }

    if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(trimmedEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    if (trimmedPassword && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(trimmedPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.',
        });
    }

    try {
        const hashedPassword = trimmedPassword ? bcryptjs.hashSync(trimmedPassword, 10) : undefined;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: trimmedUsername,
                    email: trimmedEmail,
                    password: hashedPassword,
                    profilePicture,
                }
            },
            { new: true }
        );

        const { password: _, ...rest } = updatedUser._doc; 
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};


//delete user

export const deleteUser = async (req, res, next) => {

    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You are not allowed to delete this account!"));
    }

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User has been deleted successfully." });
    } catch (error) {
        next(error);
    }
};
