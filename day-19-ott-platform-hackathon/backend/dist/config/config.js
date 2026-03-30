"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const envVarsSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['production', 'development', 'test']),
    PORT: zod_1.z.coerce.number().default(3000),
    MONGODB_URL: zod_1.z.string().min(1, 'Mongo DB url is required'),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT secret key is required'),
    JWT_ACCESS_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(30),
    JWT_REFRESH_EXPIRATION_DAYS: zod_1.z.coerce.number().default(30),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(10),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: zod_1.z.coerce.number().default(10),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().optional(),
    SMTP_USERNAME: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1, 'Cloudinary cloud name is required'),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1, 'Cloudinary api key is required'),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1, 'Cloudinary api secret is required'),
});
const result = envVarsSchema.safeParse(process.env);
if (!result.success) {
    throw new Error(`Config validation error: ${result.error.issues.map((i) => i.message).join(', ')}`);
}
const envVars = result.data;
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {},
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    cloudinary: {
        cloudName: envVars.CLOUDINARY_CLOUD_NAME,
        apiKey: envVars.CLOUDINARY_API_KEY,
        apiSecret: envVars.CLOUDINARY_API_SECRET,
    },
};
