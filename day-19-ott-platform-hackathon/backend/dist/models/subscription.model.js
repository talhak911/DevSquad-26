"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const paginate_plugin_1 = __importDefault(require("./plugins/paginate.plugin"));
const subscriptionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    // Card details (simulated, not real payment)
    cardLast4: { type: String, default: null },
    cardBrand: { type: String, default: null },
    cardHolderName: { type: String, default: null },
}, { timestamps: true });
subscriptionSchema.plugin(toJSON_plugin_1.default);
subscriptionSchema.plugin(paginate_plugin_1.default);
// Index for fast lookup by user
subscriptionSchema.index({ userId: 1, isActive: -1 });
const Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
exports.default = Subscription;
