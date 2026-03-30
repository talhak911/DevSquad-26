"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const paginate_plugin_1 = __importDefault(require("./plugins/paginate.plugin"));
const roles_1 = require("../config/roles");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        enum: roles_1.roles,
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: null,
    },
    subscriptionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subscription',
        default: null,
    },
    freeTrialId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'FreeTrial',
        default: null,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON_plugin_1.default);
userSchema.plugin(paginate_plugin_1.default);
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcryptjs_1.default.compare(password, user.password);
};
userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs_1.default.hash(user.password, 8);
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
