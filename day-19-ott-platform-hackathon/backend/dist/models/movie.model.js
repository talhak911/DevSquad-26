"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const paginate_plugin_1 = __importDefault(require("./plugins/paginate.plugin"));
const movieSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    genres: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        }],
    releaseYear: {
        type: Number,
        required: true,
    },
    duration: {
        type: String, // e.g. "2h 30m"
        default: null,
    },
    durationSeconds: {
        type: Number,
        default: null,
    },
    language: {
        type: [String],
        default: ['English'],
    },
    // Cloudinary media
    posterPublicId: { type: String, default: null },
    posterUrl: { type: String, default: null },
    videoPublicId: { type: String, default: null },
    videoUrl: { type: String, default: null }, // secure_url from Cloudinary
    hlsUrl: { type: String, default: null }, // HLS adaptive URL if available
    uploadStatus: {
        type: String,
        enum: ['pending', 'ready', 'failed'],
        default: 'pending',
    },
    // Discovery
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: true }, // requires subscription
    // Cast & crew
    cast: [{ name: String, image: { type: String, default: null } }],
    director: { name: String, origin: String, image: { type: String, default: null } },
    music: { name: String, origin: String, image: { type: String, default: null } },
    // Ratings stored for display
    imdbRating: { type: Number, default: null },
    streamvibeRating: { type: Number, default: null },
    // Category
    category: {
        type: String,
        enum: ['movie', 'show'],
        default: 'movie',
    },
    tags: { type: [String], default: [] },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
movieSchema.plugin(toJSON_plugin_1.default);
movieSchema.plugin(paginate_plugin_1.default);
const Movie = mongoose_1.default.model('Movie', movieSchema);
exports.default = Movie;
