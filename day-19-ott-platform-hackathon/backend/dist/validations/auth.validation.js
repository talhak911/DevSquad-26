"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.register = void 0;
const zod_1 = require("zod");
const custom_validation_1 = require("./custom.validation");
exports.register = {
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: custom_validation_1.password,
        name: zod_1.z.string().min(1),
    }),
};
exports.login = {
    body: zod_1.z.object({
        email: zod_1.z.string().min(1),
        password: zod_1.z.string().min(1),
    }),
};
exports.logout = {
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    }),
};
exports.refreshTokens = {
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    }),
};
exports.forgotPassword = {
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
};
exports.resetPassword = {
    query: zod_1.z.object({
        token: zod_1.z.string().min(1),
    }),
    body: zod_1.z.object({
        password: custom_validation_1.password,
    }),
};
exports.verifyEmail = {
    query: zod_1.z.object({
        token: zod_1.z.string().min(1),
    }),
};
