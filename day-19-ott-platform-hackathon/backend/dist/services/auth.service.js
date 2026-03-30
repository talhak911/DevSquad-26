"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const tokenService = __importStar(require("./token.service"));
const userService = __importStar(require("./user.service"));
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const tokens_1 = require("../config/tokens");
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    if (user.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Your account has been blocked');
    }
    return user;
};
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
const logout = async (refreshToken) => {
    const refreshTokenDoc = await models_1.Token.findOne({ token: refreshToken, type: tokens_1.tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
};
exports.logout = logout;
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokens_1.tokenTypes.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user.toString());
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.deleteOne();
        return tokenService.generateAuthTokens(user);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
};
exports.refreshAuth = refreshAuth;
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokens_1.tokenTypes.RESET_PASSWORD);
        const user = await userService.getUserById(resetPasswordTokenDoc.user.toString());
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(user.id, { password: newPassword });
        await models_1.Token.deleteMany({ user: user.id, type: tokens_1.tokenTypes.RESET_PASSWORD });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
};
exports.resetPassword = resetPassword;
const verifyEmail = async (verifyEmailToken) => {
    try {
        const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokens_1.tokenTypes.VERIFY_EMAIL);
        const user = await userService.getUserById(verifyEmailTokenDoc.user.toString());
        if (!user) {
            throw new Error();
        }
        await models_1.Token.deleteMany({ user: user.id, type: tokens_1.tokenTypes.VERIFY_EMAIL });
        await userService.updateUserById(user.id, { isEmailVerified: true });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
    }
};
exports.verifyEmail = verifyEmail;
