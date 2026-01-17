import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../user/user.model";
import { IUser, ILoginCredentials } from "../user/user.interface";
import config from "../../config";

const register = async (userData: IUser) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Auto-assign admin role for bdcalling emails
    const emailDomain = userData.email.toLowerCase().split("@")[1];
    if (emailDomain === "bdcalling.com" || emailDomain === "bdcalling.academy") {
        userData.role = "admin";
    }

    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt_secret,
        { expiresIn: config.jwt_expires_in }
    );

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        token,
    };
};

const login = async (credentials: ILoginCredentials) => {
    const { email, password } = credentials;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        config.jwt_secret,
        { expiresIn: config.jwt_expires_in }
    );

    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        token,
    };
};

export const AuthService = {
    register,
    login,
};
