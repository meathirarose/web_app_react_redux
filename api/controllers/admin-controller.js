import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//admin sign in

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'Email and password are required.'));
  }

  const trimmedEmail = email.trim();
  if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(trimmedEmail)) {
    return next(errorHandler(400, 'Invalid email format.'));
  }

  try {
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return next(errorHandler(401, 'User not found.'));
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid credentials.'));
    }

    if (user.isAdmin !== 1) {
      return next(errorHandler(403, 'Access denied! You are not an admin.'));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    const { password: hashedPassword, ...rest } = user._doc;

    const expiryDate = new Date(Date.now() + 3600000); 
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
};

// Retrieving user information in the admin dashboard.

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ isAdmin: 0 });
        
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


// Fetching user data based on the user ID

export const fetchUserData = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
};


// Editing user data from the admin side

export const editUserData = async (req, res, next) => {
    if (!req.params.id) {
        return next(errorHandler(401, "Internal error. User not found."));
    }

    const { username, email, password, profilePicture } = req.body;

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password ? password.trim() : null;

    if (!trimmedUsername || !trimmedEmail || !profilePicture) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, and profile picture are required and should not contain only spaces',
        });
    }

    if (trimmedUsername.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Username must be at least 3 characters long',
        });
    }

    if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(trimmedEmail)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
    }

    if (trimmedPassword) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(trimmedPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
            });
        }
    }

    try {
        const existingUser = await User.findOne({ email: trimmedEmail, _id: { $ne: req.params.id } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already in use by another user' });
        }

        const updateData = {
            username: trimmedUsername,
            email: trimmedEmail,
            profilePicture,
        };

        if (trimmedPassword) {
            const hashedPassword = bcryptjs.hashSync(trimmedPassword, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};


// add new user

export const addNewUser = async (req, res, next) => {
    const { username, email, password, profilePicture } = req.body;

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword || !profilePicture) {
        return res.status(400).json({ success: false, message: 'All fields are required and should not contain only spaces' });
    }

    if (trimmedUsername.length < 3) {
        return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
    }

    if (!/^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(trimmedEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(trimmedPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character',
        });
    }

    try {
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = bcryptjs.hashSync(trimmedPassword, 10);

        const newUser = new User({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword,
            profilePicture,
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User added successfully' });
    } catch (error) {
        next(error);
        res.status(500).json({ success: false, message: 'Error adding user' });
    }
};


// delete user from the admin side

export const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    if(!req.params.id){
        return next(errorHandler(401, "Internal error. User not found."));
    }

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json("User has been deleted...")
    } catch (error) {
        next(error);
    }
}


// admin signout

export const signout = (req, res) => {
    res.clearCookie('access_token').status(200).json('Signout success!');
  };