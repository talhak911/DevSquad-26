"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsset = exports.generateSignature = exports.CLOUDINARY_CONFIG = exports.uploadVideo = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config/config"));
const streamifier_1 = __importDefault(require("streamifier"));
// Cloudinary is configured via environment variables automatically
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary_1.v2.config({
    cloud_name: ((_a = config_1.default.cloudinary) === null || _a === void 0 ? void 0 : _a.cloudName) || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: ((_b = config_1.default.cloudinary) === null || _b === void 0 ? void 0 : _b.apiKey) || process.env.CLOUDINARY_API_KEY,
    api_secret: ((_c = config_1.default.cloudinary) === null || _c === void 0 ? void 0 : _c.apiSecret) || process.env.CLOUDINARY_API_SECRET,
    secure: true,
});
/**
 * Upload an image buffer to Cloudinary
 */
const uploadImage = (buffer, folder = 'ott/posters') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: 'image',
            transformation: [{ width: 800, height: 1200, crop: 'fill', quality: 'auto' }],
        }, (err, result) => {
            if (err)
                return reject(err);
            if (!result)
                return reject(new Error('No result from Cloudinary'));
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
exports.uploadImage = uploadImage;
/**
 * Upload a video buffer to Cloudinary.
 * Returns the secure_url for direct MP4 delivery and optionally HLS format.
 */
const uploadVideo = (buffer, folder = 'ott/videos') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: 'video',
            chunk_size: 6000000, // 6MB chunks for large files
            eager: exports.CLOUDINARY_CONFIG.video_eager,
            eager_async: true,
        }, (err, result) => {
            var _a, _b;
            if (err)
                return reject(err);
            if (!result)
                return reject(new Error('No result from Cloudinary'));
            // HLS URL if eager transformation was requested
            const hlsUrl = ((_b = (_a = result.eager) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.secure_url) || null;
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
                hlsUrl,
                duration: result.duration ? Math.round(result.duration) : null,
            });
        });
        streamifier_1.default.createReadStream(buffer).pipe(stream);
    });
};
exports.uploadVideo = uploadVideo;
exports.CLOUDINARY_CONFIG = {
    video_folder: 'ott/videos',
    image_folder: 'ott/posters',
    video_eager: 'sp_hd/m3u8',
};
/**
 * Generate a signature for a signed upload to Cloudinary
 */
const generateSignature = (params) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary_1.v2.utils.api_sign_request({ ...params, timestamp }, cloudinary_1.v2.config().api_secret);
    return { signature, timestamp };
};
exports.generateSignature = generateSignature;
/**
 * Delete any Cloudinary asset by public_id
 */
const deleteAsset = async (publicId, resourceType = 'image') => {
    await cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
};
exports.deleteAsset = deleteAsset;
