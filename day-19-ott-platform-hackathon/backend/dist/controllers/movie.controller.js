"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playMovie = exports.getMovie = exports.listMovies = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
// ─── Public ──────────────────────────────────────────────────────────────────
exports.listMovies = (0, catchAsync_1.default)(async (req, res) => {
    const { search, genre, year, category, isPremium, page = 1, limit = 12, sortBy } = req.query;
    const filter = {};
    if (genre) {
        filter.genre = Array.isArray(genre) ? { $in: genre } : genre;
    }
    if (year)
        filter.releaseYear = Number(year);
    if (category)
        filter.category = String(category);
    if (isPremium !== undefined)
        filter.isPremium = isPremium === 'true';
    if (search) {
        filter.$or = [
            { title: { $regex: String(search), $options: 'i' } },
            { description: { $regex: String(search), $options: 'i' } },
        ];
    }
    const result = await services_1.movieService.queryMovies(filter, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy,
    });
    res.send(result);
});
exports.getMovie = (0, catchAsync_1.default)(async (req, res) => {
    const movie = await services_1.movieService.getMovieById(req.params.movieId);
    // Increment view count asynchronously
    services_1.movieService.incrementViews(req.params.movieId).catch(() => { });
    res.send(movie);
});
// ─── Protected: returns stream URL ────────────────────────────────────────────
exports.playMovie = (0, catchAsync_1.default)(async (req, res) => {
    const movie = await services_1.movieService.getMovieById(req.params.movieId);
    if (!movie.isPublished) {
        return res.status(http_status_1.default.NOT_FOUND).json({ message: 'Movie not available' });
    }
    if (movie.uploadStatus !== 'ready' || !movie.videoUrl) {
        return res.status(http_status_1.default.SERVICE_UNAVAILABLE).json({ message: 'Video not ready for streaming yet' });
    }
    const user = req.user;
    // Blocked user check
    if (user.isBlocked) {
        return res.status(http_status_1.default.FORBIDDEN).json({ message: 'Your account has been blocked' });
    }
    // Access check if premium content
    if (movie.isPremium) {
        const hasAccess = await services_1.subscriptionService.hasActiveAccess(user.id);
        if (!hasAccess) {
            return res.status(http_status_1.default.PAYMENT_REQUIRED).json({
                message: 'Subscription required to watch this content',
                requiresSubscription: true,
            });
        }
    }
    res.send({
        streamUrl: movie.hlsUrl || movie.videoUrl,
        hlsUrl: movie.hlsUrl,
        mp4Url: movie.videoUrl,
        title: movie.title,
        posterUrl: movie.posterUrl,
    });
});
