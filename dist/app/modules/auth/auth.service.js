"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user already exists
    const existingUser = yield user_model_1.User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    // Auto-assign admin role for bdcalling emails
    const emailDomain = userData.email.toLowerCase().split("@")[1];
    if (emailDomain === "bdcalling.com" || emailDomain === "bdcalling.academy") {
        userData.role = "admin";
    }
    const user = yield user_model_1.User.create(userData);
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, config_1.default.jwt_secret, { expiresIn: config_1.default.jwt_expires_in });
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
});
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = credentials;
    // Find user with password field
    const user = yield user_model_1.User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Invalid email or password");
    }
    // Check password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, config_1.default.jwt_secret, { expiresIn: config_1.default.jwt_expires_in });
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
});
exports.AuthService = {
    register,
    login,
};
