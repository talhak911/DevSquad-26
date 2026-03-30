"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.createPlan = exports.listPlans = exports.adminTogglePublish = exports.adminDeleteMovie = exports.adminUpdateMovie = exports.adminCreateMovie = exports.getCloudinarySignature = exports.adminGetMovie = exports.adminListMovies = exports.unblockUser = exports.blockUser = exports.listUsers = exports.getDashboardStats = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
const user_model_1 = __importDefault(require("../models/user.model"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const cloudinaryService = __importStar(require("../services/cloudinary.service"));
const cloudinary_1 = require("cloudinary");
const parseJson = (val) => {
    if (typeof val === 'string' && (val.trim().startsWith('[') || val.trim().startsWith('{'))) {
        try {
            return JSON.parse(val);
        }
        catch (e) {
            return val;
        }
    }
    return val;
};
const normalizeToObject = (val) => {
    if (typeof val === 'string' && val.trim() !== '') {
        return { name: val.trim() };
    }
    if (!val || (typeof val === 'string' && val.trim() === '')) {
        return { name: '', origin: '', image: null };
    }
    return val;
};
// ─── Dashboard Stats ──────────────────────────────────────────────────────────
exports.getDashboardStats = (0, catchAsync_1.default)(async (_req, res) => {
    const [totalMovies, publishedMovies, totalUsers, blockedUsers] = await Promise.all([
        movie_model_1.default.countDocuments(),
        movie_model_1.default.countDocuments({ isPublished: true }),
        user_model_1.default.countDocuments({ role: 'user' }),
        user_model_1.default.countDocuments({ isBlocked: true }),
    ]);
    res.send({ totalMovies, publishedMovies, totalUsers, blockedUsers });
});
// ─── User Management ─────────────────────────────────────────────────────────
exports.listUsers = (0, catchAsync_1.default)(async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { role: 'user' };
    if (search) {
        filter.$or = [
            { name: { $regex: String(search), $options: 'i' } },
            { email: { $regex: String(search), $options: 'i' } },
        ];
    }
    const [users, total] = await Promise.all([
        user_model_1.default.find(filter).skip(skip).limit(Number(limit)).select('-password'),
        user_model_1.default.countDocuments(filter),
    ]);
    res.send({ results: users, page: Number(page), limit: Number(limit), totalResults: total, totalPages: Math.ceil(total / Number(limit)) });
});
exports.blockUser = (0, catchAsync_1.default)(async (req, res) => {
    await user_model_1.default.findByIdAndUpdate(req.params.userId, { isBlocked: true });
    res.send({ message: 'User blocked' });
});
exports.unblockUser = (0, catchAsync_1.default)(async (req, res) => {
    await user_model_1.default.findByIdAndUpdate(req.params.userId, { isBlocked: false });
    res.send({ message: 'User unblocked' });
});
// ─── Movie Management ─────────────────────────────────────────────────────────
exports.adminListMovies = (0, catchAsync_1.default)(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [movies, total] = await Promise.all([
        movie_model_1.default.find().populate('genres', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        movie_model_1.default.countDocuments(),
    ]);
    res.send({ results: movies, page: Number(page), limit: Number(limit), totalResults: total, totalPages: Math.ceil(total / Number(limit)) });
});
exports.adminGetMovie = (0, catchAsync_1.default)(async (req, res) => {
    const movie = await services_1.movieService.getMovieById(req.params.movieId);
    res.send(movie);
});
exports.getCloudinarySignature = (0, catchAsync_1.default)(async (req, res) => {
    const { type } = req.query; // 'image' or 'video'
    const folder = type === 'video' ? cloudinaryService.CLOUDINARY_CONFIG.video_folder : cloudinaryService.CLOUDINARY_CONFIG.image_folder;
    const params = { folder };
    if (type === 'video') {
        params.eager = cloudinaryService.CLOUDINARY_CONFIG.video_eager;
        params.eager_async = true;
    }
    const { signature, timestamp } = cloudinaryService.generateSignature(params);
    res.send({
        signature,
        timestamp,
        cloudName: cloudinary_1.v2.config().cloud_name,
        apiKey: cloudinary_1.v2.config().api_key,
        folder,
        ...(type === 'video' ? { eager: params.eager, eager_async: true } : {}),
    });
});
exports.adminCreateMovie = (0, catchAsync_1.default)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    const posterBuffer = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.buffer;
    const videoBuffer = (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.video) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.buffer;
    const genres = parseJson(req.body.genres);
    const language = parseJson(req.body.language);
    const cast = parseJson(req.body.cast);
    const director = normalizeToObject(parseJson(req.body.director));
    const music = normalizeToObject(parseJson(req.body.music));
    const releaseYear = Number(req.body.releaseYear);
    const isPremium = req.body.isPremium !== undefined ? req.body.isPremium === 'true' || req.body.isPremium === true : undefined;
    const isPublished = req.body.isPublished !== undefined ? req.body.isPublished === 'true' || req.body.isPublished === true : undefined;
    const movie = await services_1.movieService.createMovie({
        ...req.body,
        isPremium,
        isPublished,
        genres,
        language,
        cast,
        director,
        music,
        releaseYear,
        createdBy: req.user.id,
        posterBuffer,
        videoBuffer,
        // Direct upload fields
        posterUrl: req.body.posterUrl,
        posterPublicId: req.body.posterPublicId,
        videoUrl: req.body.videoUrl,
        videoPublicId: req.body.videoPublicId,
        hlsUrl: req.body.hlsUrl,
        duration: req.body.duration ? Number(req.body.duration) : undefined,
    });
    res.status(http_status_1.default.CREATED).send(movie);
});
exports.adminUpdateMovie = (0, catchAsync_1.default)(async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    const posterBuffer = (_c = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.buffer;
    const videoBuffer = (_f = (_e = (_d = req.files) === null || _d === void 0 ? void 0 : _d.video) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.buffer;
    const genres = parseJson(req.body.genres);
    const language = parseJson(req.body.language);
    // Sanitize cast: strip any Mongoose subdoc _id/id fields the client may have sent back
    const rawCast = parseJson(req.body.cast);
    const cast = Array.isArray(rawCast)
        ? rawCast.map(({ name, image }) => ({ name, ...(image ? { image } : {}) }))
        : rawCast;
    const director = normalizeToObject(parseJson(req.body.director));
    const music = normalizeToObject(parseJson(req.body.music));
    const isPremium = req.body.isPremium !== undefined ? req.body.isPremium === 'true' || req.body.isPremium === true : undefined;
    const isPublished = req.body.isPublished !== undefined ? req.body.isPublished === 'true' || req.body.isPublished === true : undefined;
    const movie = await services_1.movieService.updateMovie(req.params.movieId, {
        ...req.body,
        isPremium,
        isPublished,
        genres,
        language,
        cast,
        director,
        music,
        posterBuffer,
        videoBuffer,
        // Direct upload fields
        posterUrl: req.body.posterUrl,
        posterPublicId: req.body.posterPublicId,
        videoUrl: req.body.videoUrl,
        videoPublicId: req.body.videoPublicId,
        hlsUrl: req.body.hlsUrl,
        duration: req.body.duration ? Number(req.body.duration) : undefined,
    });
    res.send(movie);
});
exports.adminDeleteMovie = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.movieService.deleteMovie(req.params.movieId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
exports.adminTogglePublish = (0, catchAsync_1.default)(async (req, res) => {
    const movie = await services_1.movieService.getMovieById(req.params.movieId);
    await services_1.movieService.updateMovie(req.params.movieId, { isPublished: !movie.isPublished });
    res.send({ isPublished: !(movie.isPublished) });
});
// ─── Plan Management ─────────────────────────────────────────────────────────
exports.listPlans = (0, catchAsync_1.default)(async (_req, res) => {
    const plans = await services_1.planService.queryPlans(false);
    res.send(plans);
});
exports.createPlan = (0, catchAsync_1.default)(async (req, res) => {
    const plan = await services_1.planService.createPlan(req.body);
    res.status(http_status_1.default.CREATED).send(plan);
});
exports.updatePlan = (0, catchAsync_1.default)(async (req, res) => {
    const plan = await services_1.planService.updatePlan(req.params.planId, req.body);
    res.send(plan);
});
exports.deletePlan = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.planService.deletePlan(req.params.planId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
