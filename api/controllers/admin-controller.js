import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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