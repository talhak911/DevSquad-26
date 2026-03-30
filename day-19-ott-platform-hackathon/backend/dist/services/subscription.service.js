"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFreeTrial = exports.activateFreeTrial = exports.getUserSubscription = exports.activateSubscription = exports.hasActiveAccess = void 0;
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const freeTrial_model_1 = __importDefault(require("../models/freeTrial.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const plan_service_1 = require("./plan.service");
/**
 * Check whether a user currently has an active subscription or free trial
 */
const hasActiveAccess = async (userId) => {
    const now = new Date();
    // Check subscription
    const sub = await subscription_model_1.default.findOne({ userId, isActive: true, endDate: { $gt: now } });
    if (sub)
        return true;
    // Check free trial
    const trial = await freeTrial_model_1.default.findOne({ userId, endDate: { $gt: now } });
    if (trial)
        return true;
    return false;
};
exports.hasActiveAccess = hasActiveAccess;
/**
 * Activate a paid subscription for a user
 */
const activateSubscription = async (userId, planId, cardDetails) => {
    const plan = await (0, plan_service_1.getPlanById)(planId);
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    // Deactivate any existing active subscription
    await subscription_model_1.default.updateMany({ userId, isActive: true }, { isActive: false });
    const startDate = new Date();
    const endDate = (0, moment_1.default)(startDate).add(plan.durationDays, 'days').toDate();
    const cardLast4 = cardDetails.cardNumber.replace(/\s/g, '').slice(-4);
    const subscription = await subscription_model_1.default.create({
        userId,
        planId,
        startDate,
        endDate,
        isActive: true,
        cardLast4,
        cardBrand: 'card', // simplified for hackathon
        cardHolderName: cardDetails.cardHolderName,
    });
    // Link on user
    await user_model_1.default.findByIdAndUpdate(userId, { subscriptionId: subscription._id });
    return subscription;
};
exports.activateSubscription = activateSubscription;
/**
 * Get the user's active subscription (populated with plan)
 */
const getUserSubscription = async (userId) => {
    return subscription_model_1.default.findOne({ userId, isActive: true }).populate('planId');
};
exports.getUserSubscription = getUserSubscription;
/**
 * Activate a free trial for a user
 */
const activateFreeTrial = async (userId) => {
    const existing = await freeTrial_model_1.default.findOne({ userId });
    if (existing)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Free trial already used');
    const startDate = new Date();
    const endDate = (0, moment_1.default)(startDate).add(7, 'days').toDate(); // 7-day trial
    const trial = await freeTrial_model_1.default.create({ userId, startDate, endDate, isUsed: true });
    await user_model_1.default.findByIdAndUpdate(userId, { freeTrialId: trial._id });
    return trial;
};
exports.activateFreeTrial = activateFreeTrial;
/**
 * Get the user's free trial info
 */
const getUserFreeTrial = async (userId) => {
    return freeTrial_model_1.default.findOne({ userId });
};
exports.getUserFreeTrial = getUserFreeTrial;
