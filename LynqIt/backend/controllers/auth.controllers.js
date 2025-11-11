import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"
import logger from "../utils/logger.js"
import { AuthenticationError, ValidationError } from "../utils/errors/AppError.js"

const tokenCookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true
};
export const signUp = async (req, res, next) => {
    try {
        const { name, email, password, mobile, role } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName: name,
            email,
            role,
            mobile,
            password: hashedPassword
        });

        const token = await genToken(user._id);
        res.cookie("token", token, tokenCookieOptions);

        logger.info('New user registered', { userId: user._id, email: user.email });
        return res.status(201).json(user);

    } catch (error) {
        logger.error('Signup error', { error: error.message });
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AuthenticationError('Invalid email or password');
        }

        const token = await genToken(user._id);
        res.cookie("token", token, tokenCookieOptions);

        logger.info('User signed in', { userId: user._id });
        return res.status(200).json(user);

    } catch (error) {
        logger.error('Signin error', { error: error.message });
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("token");
        logger.info('User signed out');
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        logger.error('Signout error', { error: error.message });
        next(error);
    }
};

export const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new ValidationError('User does not exist');
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
        user.isOtpVerified = false;
        await user.save();

        await sendOtpMail(email, otp);
        
        logger.info('OTP sent', { userId: user._id, email });
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        logger.error('Send OTP error', { error: error.message });
        next(error);
    }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            throw new ValidationError('Invalid or expired OTP');
        }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        logger.info('OTP verified', { userId: user._id });
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        logger.error('Verify OTP error', { error: error.message });
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.isOtpVerified) {
            throw new ValidationError('OTP verification required');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();

        logger.info('Password reset', { userId: user._id });
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        logger.error('Reset password error', { error: error.message });
        next(error);
    }
};

export const googleAuth = async (req, res, next) => {
    try {
        const { fullName, email, mobile, role } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                fullName,
                email,
                mobile,
                role
            });
            logger.info('New user registered via Google', { userId: user._id, email });
        }

        const token = await genToken(user._id);
        res.cookie("token", token, tokenCookieOptions);

        logger.info('User authenticated via Google', { userId: user._id });
        return res.status(200).json(user);
    } catch (error) {
        logger.error('Google auth error', { error: error.message });
        next(error);
    }
};