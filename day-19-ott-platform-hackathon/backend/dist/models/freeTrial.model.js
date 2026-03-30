"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const freeTrialSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // one free trial per user ever
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isUsed: { type: Boolean, default: true },
}, { timestamps: true });
freeTrialSchema.plugin(toJSON_plugin_1.default);
const FreeTrial = mongoose_1.default.model('FreeTrial', freeTrialSchema);
exports.default = FreeTrial;
