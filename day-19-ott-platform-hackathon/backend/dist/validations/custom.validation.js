"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = exports.objectId = void 0;
const zod_1 = require("zod");
exports.objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, '"{{label}}" must be a valid mongo id');
exports.password = zod_1.z
    .string()
    .min(8, 'password must be at least 8 characters')
    .regex(/\d/, 'password must contain at least 1 letter and 1 number')
    .regex(/[a-zA-Z]/, 'password must contain at least 1 letter and 1 number');
