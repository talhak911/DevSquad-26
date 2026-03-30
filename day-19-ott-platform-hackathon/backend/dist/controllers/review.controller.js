"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieReviews = exports.createReview = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const review_model_1 = __importDefault(require("../models/review.model"));
exports.createReview = (0, catchAsync_1.default)(async (req, res) => {
    const { movieId, rating, content } = req.body;
    const review = await review_model_1.default.create({
        movie: movieId,
        user: req.user.id,
        rating,
        content,
    });
    // Populate user data for response
    const populated = await review.populate('user', 'name profilePic');
    res.status(http_status_1.default.CREATED).send(populated);
});
exports.getMovieReviews = (0, catchAsync_1.default)(async (req, res) => {
    const reviews = await review_model_1.default.find({ movie: req.params.movieId })
        .populate('user', 'name profilePic')
        .sort({ createdAt: -1 });
    res.send(reviews);
});
