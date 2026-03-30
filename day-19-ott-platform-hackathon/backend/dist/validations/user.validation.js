"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const zod_1 = require("zod");
const custom_validation_1 = require("./custom.validation");
exports.createUser = {
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: custom_validation_1.password,
        name: zod_1.z.string().min(1),
        role: zod_1.z.enum(['user', 'admin']),
    }),
};
exports.getUsers = {
    query: zod_1.z.object({
        name: zod_1.z.string().optional(),
        role: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().int().optional(),
        page: zod_1.z.coerce.number().int().optional(),
    }),
};
exports.getUser = {
    params: zod_1.z.object({
        userId: custom_validation_1.objectId,
    }),
};
exports.updateUser = {
    params: zod_1.z.object({
        userId: custom_validation_1.objectId,
    }),
    body: zod_1.z
        .object({
        email: zod_1.z.string().email().optional(),
        password: custom_validation_1.password.optional(),
        name: zod_1.z.string().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' }),
};
exports.deleteUser = {
    params: zod_1.z.object({
        userId: custom_validation_1.objectId,
    }),
};
