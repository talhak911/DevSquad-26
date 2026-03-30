"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateFreeTrial = exports.getMySubscription = exports.activateSubscription = exports.getPlans = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const services_1 = require("../services");
// ─── Plans (public) ────────────────────────────────────────────────────────────
exports.getPlans = (0, catchAsync_1.default)(async (_req, res) => {
    const plans = await services_1.planService.queryPlans(true);
    res.send(plans);
});
// ─── Subscription ─────────────────────────────────────────────────────────────
exports.activateSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const { planId, cardNumber, cardHolderName, expiry, cvv } = req.body;
    const subscription = await services_1.subscriptionService.activateSubscription(req.user.id, planId, {
        cardNumber, cardHolderName, expiry, cvv,
    });
    res.status(http_status_1.default.CREATED).send(subscription);
});
exports.getMySubscription = (0, catchAsync_1.default)(async (req, res) => {
    const subscription = await services_1.subscriptionService.getUserSubscription(req.user.id);
    const freeTrial = await services_1.subscriptionService.getUserFreeTrial(req.user.id);
    res.send({ subscription, freeTrial });
});
// ─── Free Trial ───────────────────────────────────────────────────────────────
exports.activateFreeTrial = (0, catchAsync_1.default)(async (req, res) => {
    const trial = await services_1.subscriptionService.activateFreeTrial(req.user.id);
    res.status(http_status_1.default.CREATED).send(trial);
});
