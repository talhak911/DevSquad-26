"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const paginate_plugin_1 = __importDefault(require("./plugins/paginate.plugin"));
const reviewSchema = new mongoose_1.default.Schema({
    movie: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
reviewSchema.plugin(toJSON_plugin_1.default);
reviewSchema.plugin(paginate_plugin_1.default);
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
