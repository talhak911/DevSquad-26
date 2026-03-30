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
exports.incrementViews = exports.deleteMovie = exports.updateMovie = exports.getMovieById = exports.queryMovies = exports.createMovie = void 0;
const http_status_1 = __importDefault(require("http-status"));
const movie_model_1 = __importDefault(require("../models/movie.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const cloudinaryService = __importStar(require("./cloudinary.service"));
/**
 * Create a movie with optional Cloudinary uploads
 */
const createMovie = async (data) => {
    const movieData = {
        title: data.title,
        description: data.description,
        genres: data.genres,
        releaseYear: data.releaseYear,
        category: data.category || 'movie',
        tags: data.tags || [],
        isPremium: data.isPremium !== undefined ? data.isPremium : true,
        language: data.language || ['English'],
        cast: data.cast || [],
        director: data.director,
        music: data.music,
        imdbRating: data.imdbRating,
        streamvibeRating: data.streamvibeRating,
        createdBy: data.createdBy,
        uploadStatus: 'pending',
    };
    // Upload poster if provided (buffer)
    if (data.posterBuffer) {
        const { secure_url, public_id } = await cloudinaryService.uploadImage(data.posterBuffer);
        movieData.posterUrl = secure_url;
        movieData.posterPublicId = public_id;
    }
    else if (data.posterUrl && data.posterPublicId) {
        // Or use pre-uploaded poster from direct signed upload
        movieData.posterUrl = data.posterUrl;
        movieData.posterPublicId = data.posterPublicId;
    }
    // Upload video if provided (buffer)
    if (data.videoBuffer) {
        const { secure_url, public_id, hlsUrl, duration } = await cloudinaryService.uploadVideo(data.videoBuffer);
        movieData.videoUrl = secure_url;
        movieData.videoPublicId = public_id;
        movieData.hlsUrl = hlsUrl;
        movieData.uploadStatus = 'ready';
        if (duration) {
            const h = Math.floor(duration / 3600);
            const m = Math.floor((duration % 3600) / 60);
            movieData.duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
            movieData.durationSeconds = duration;
        }
    }
    else if (data.videoUrl && data.videoPublicId) {
        // Or use pre-uploaded video from direct signed upload
        movieData.videoUrl = data.videoUrl;
        movieData.videoPublicId = data.videoPublicId;
        movieData.hlsUrl = data.hlsUrl;
        movieData.uploadStatus = 'ready';
        if (data.duration) {
            const h = Math.floor(data.duration / 3600);
            const m = Math.floor((data.duration % 3600) / 60);
            movieData.duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
            movieData.durationSeconds = data.duration;
        }
    }
    return movie_model_1.default.create(movieData);
};
exports.createMovie = createMovie;
/**
 * Query movies with pagination, search, and filters
 */
const queryMovies = async (filter, options) => {
    const page = options.page || 1;
    const limit = options.limit || 12;
    const skip = (page - 1) * limit;
    const query = { isPublished: true, ...filter };
    // Handle genre filter (which is now dynamic categories)
    if (filter.genre) {
        query.genres = filter.genre;
        delete query.genre;
    }
    const [movies, total] = await Promise.all([
        movie_model_1.default.find(query)
            .populate('genres', 'name slug')
            .sort(options.sortBy === 'newest' ? { releaseYear: -1 } : { createdAt: -1 })
            .skip(skip)
            .limit(limit),
        movie_model_1.default.countDocuments(query),
    ]);
    return {
        results: movies,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
    };
};
exports.queryMovies = queryMovies;
/**
 * Get a single movie by id
 */
const getMovieById = async (id) => {
    const movie = await movie_model_1.default.findById(id).populate('genres', 'name slug');
    if (!movie)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Movie not found');
    return movie;
};
exports.getMovieById = getMovieById;
/**
 * Update a movie's metadata or re-upload media
 */
const updateMovie = async (id, updateData) => {
    const movie = await (0, exports.getMovieById)(id);
    // Replace poster if new buffer provided
    if (updateData.posterBuffer) {
        if (movie.posterPublicId)
            await cloudinaryService.deleteAsset(movie.posterPublicId, 'image');
        const { secure_url, public_id } = await cloudinaryService.uploadImage(updateData.posterBuffer);
        movie.posterUrl = secure_url;
        movie.posterPublicId = public_id;
    }
    else if (updateData.posterUrl && updateData.posterPublicId && updateData.posterPublicId !== movie.posterPublicId) {
        // Or use pre-uploaded poster from direct signed upload
        if (movie.posterPublicId)
            await cloudinaryService.deleteAsset(movie.posterPublicId, 'image');
        movie.posterUrl = updateData.posterUrl;
        movie.posterPublicId = updateData.posterPublicId;
    }
    // Replace video if new buffer provided
    if (updateData.videoBuffer) {
        if (movie.videoPublicId)
            await cloudinaryService.deleteAsset(movie.videoPublicId, 'video');
        const { secure_url, public_id, hlsUrl, duration } = await cloudinaryService.uploadVideo(updateData.videoBuffer);
        movie.videoUrl = secure_url;
        movie.videoPublicId = public_id;
        movie.hlsUrl = hlsUrl;
        movie.uploadStatus = 'ready';
        if (duration) {
            const h = Math.floor(duration / 3600);
            const m = Math.floor((duration % 3600) / 60);
            movie.duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
            movie.durationSeconds = duration;
        }
    }
    else if (updateData.videoUrl && updateData.videoPublicId && updateData.videoPublicId !== movie.videoPublicId) {
        // Or use pre-uploaded video from direct signed upload
        if (movie.videoPublicId)
            await cloudinaryService.deleteAsset(movie.videoPublicId, 'video');
        movie.videoUrl = updateData.videoUrl;
        movie.videoPublicId = updateData.videoPublicId;
        movie.hlsUrl = updateData.hlsUrl;
        movie.uploadStatus = 'ready';
        if (updateData.duration) {
            const h = Math.floor(updateData.duration / 3600);
            const m = Math.floor((updateData.duration % 3600) / 60);
            movie.duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
            movie.durationSeconds = updateData.duration;
        }
    }
    // Update scalar fields
    const scalarFields = ['title', 'description', 'genres', 'releaseYear', 'category', 'tags', 'isPremium', 'language', 'isPublished', 'cast', 'director', 'music', 'imdbRating', 'streamvibeRating'];
    scalarFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            movie[field] = updateData[field];
        }
    });
    await movie.save();
    return movie;
};
exports.updateMovie = updateMovie;
/**
 * Delete a movie and its Cloudinary assets
 */
const deleteMovie = async (id) => {
    const movie = await (0, exports.getMovieById)(id);
    if (movie.posterPublicId)
        await cloudinaryService.deleteAsset(movie.posterPublicId, 'image');
    if (movie.videoPublicId)
        await cloudinaryService.deleteAsset(movie.videoPublicId, 'video');
    await movie.deleteOne();
};
exports.deleteMovie = deleteMovie;
/**
 * Increment view count
 */
const incrementViews = async (id) => {
    await movie_model_1.default.findByIdAndUpdate(id, { $inc: { views: 1 } });
};
exports.incrementViews = incrementViews;
