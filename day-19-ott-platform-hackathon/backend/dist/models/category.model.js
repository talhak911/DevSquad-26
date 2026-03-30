"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const plugins_1 = require("./plugins");
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    thumbnail: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
categorySchema.plugin(plugins_1.toJSON);
categorySchema.plugin(plugins_1.paginate);
/**
 * @typedef Category
 */
const Category = mongoose_1.default.model('Category', categorySchema);
exports.default = Category;
