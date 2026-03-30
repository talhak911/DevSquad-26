"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserById = exports.getUserByEmail = exports.getUserById = exports.queryUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createUser = async (userBody) => {
    if (await models_1.User.isEmailTaken(userBody.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    return models_1.User.create(userBody);
};
exports.createUser = createUser;
const queryUsers = async (filter, options) => {
    const users = await models_1.User.paginate(filter, options);
    return users;
};
exports.queryUsers = queryUsers;
const getUserById = async (id) => {
    return models_1.User.findById(id);
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    return models_1.User.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
const updateUserById = async (userId, updateBody) => {
    const user = await (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await models_1.User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};
exports.updateUserById = updateUserById;
const deleteUserById = async (userId) => {
    const user = await (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    await user.deleteOne();
    return user;
};
exports.deleteUserById = deleteUserById;
