"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toJSON_plugin_1 = __importDefault(require("./plugins/toJSON.plugin"));
const paginate_plugin_1 = __importDefault(require("./plugins/paginate.plugin"));
const planSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
planSchema.plugin(toJSON_plugin_1.default);
planSchema.plugin(paginate_plugin_1.default);
const Plan = mongoose_1.default.model('Plan', planSchema);
exports.default = Plan;
