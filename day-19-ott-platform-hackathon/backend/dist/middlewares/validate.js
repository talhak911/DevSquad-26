"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../utils/pick"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const validate = (schema) => (req, res, next) => {
    const validSchema = (0, pick_1.default)(schema, ['params', 'query', 'body']);
    const keys = Object.keys(validSchema);
    const errors = [];
    const merged = {};
    for (const key of keys) {
        const zodSchema = validSchema[key];
        if (!zodSchema)
            continue;
        const result = zodSchema.safeParse(req[key]);
        if (!result.success) {
            const messages = result.error.issues.map((e) => e.message);
            errors.push(...messages);
        }
        else {
            merged[key] = result.data;
        }
    }
    if (errors.length > 0) {
        return next(new ApiError_1.default(http_status_1.default.BAD_REQUEST, errors.join(', ')));
    }
    // Merge validated values back into req
    Object.assign(req, merged);
    return next();
};
exports.default = validate;
