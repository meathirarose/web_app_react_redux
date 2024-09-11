import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//admin sign in

export const signin = async (req, res, next) => {
    const {email, password} = req.body;

    try {
        const admin = await User.findOne({email});
        if(!admin) return next(errorHandler(401, 'User not found'));

        const validPassword = bcryptjs.compareSync(password, admin.password);
        if(!validPassword) return next(errorHandler(401, 'Invalid credentials'));

        if(admin.isAdmin !== 1)
            return next(errorHandler(403, 'Access denied! You are not an admin.!'));

        const token = jwt.sign({id: admin._id, isAdmin: admin.isAdmin}, process.env.JWT_SECRET);
        const {password: hashedPassword, ...rest} = admin._doc;

        const expiryDate = new Date(Date.now() + 3600000);
        res
          .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
          .status(200)
          .json(rest);

    } catch (error) {
        next(error)
    }
}

// Retrieving user information in the admin dashboard.

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({isAdmin: 0});
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}

// Fetching user data based on the user ID

export const fetchUserData = async (req, res, next) => {
    const userId = req.params.id;
    
    try {
        const userData = await User.findById({_id: userId});
        res.status(200).json(userData);
    } catch (error) {
        next(error)
    }
}

// Editing user data from the admin side

export const editUserData = async (req, res, next) => {

    if(!req.params.id)
        return next(errorHandler(401, "Internal error. User not found."));
    
    if(req.body.password)
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    

    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
                $set: {
                    username: req.body.username, 
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture
                }
            },{new: true}
        )

        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error)   
    }
}

// delete user from the admin side

export const deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json("User deleted successfully.!")
    } catch (error) {
        next(error);
    }
}

// admin signout

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout success!');
  };