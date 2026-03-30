"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const models_1 = require("./models");
const seed = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB for seeding...');
        // 1. Create Plans
        await models_1.Plan.deleteMany({});
        const plans = await models_1.Plan.insertMany([
            { name: 'Basic', price: 9.99, durationDays: 30, features: ['Standard Quality', '720p Resolution', '1 Device', 'Mobile Support'], isActive: true },
            { name: 'Standard', price: 14.99, durationDays: 30, features: ['HD Quality', '1080p Resolution', '2 Devices', 'TV Support'], isActive: true },
            { name: 'Premium', price: 19.99, durationDays: 30, features: ['Ultra HD Quality', '4K Resolution', '4 Devices', 'HDR & Dolby Atmos'], isActive: true },
        ]);
        console.log('Plans seeded.');
        // 2. Create Admin (password: admin123)
        const adminEmail = 'admin@streamvibe.com';
        await models_1.User.deleteOne({ email: adminEmail });
        const admin = await models_1.User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: 'password1', // will be hashed by pre-save
            role: 'admin',
            isEmailVerified: true,
        });
        console.log('Admin user created.');
        // 3. Create sample movies
        await models_1.Movie.deleteMany({});
        await models_1.Movie.insertMany([
            {
                title: 'Stranger Things',
                description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
                genre: ['Sci-Fi', 'Horror', 'Mystery'],
                releaseYear: 2016,
                category: 'show',
                isPublished: true,
                isPremium: true,
                createdBy: admin._id,
                posterUrl: 'https://image.tmdb.org/t/p/original/49WJfev0moxm9zEE6S7B6yQHvM3.jpg',
                videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1642500000/dog.mp4', // fallback
                views: 1250321,
            },
            {
                title: 'The Dark Knight',
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                genre: ['Action', 'Crime', 'Drama'],
                releaseYear: 2008,
                category: 'movie',
                isPublished: true,
                isPremium: true,
                createdBy: admin._id,
                posterUrl: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDp9QEQBnN6qSuaqcy2.jpg',
                views: 890422,
            },
            {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                genre: ['Action', 'Sci-Fi', 'Adventure'],
                releaseYear: 2010,
                category: 'movie',
                isPublished: true,
                isPremium: false, // Free movie
                createdBy: admin._id,
                posterUrl: 'https://image.tmdb.org/t/p/original/edv5CZvRjS99vO6YCcIqiSRCcZ8.jpg',
                views: 456789,
            }
        ]);
        console.log('Movies seeded.');
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
seed();
