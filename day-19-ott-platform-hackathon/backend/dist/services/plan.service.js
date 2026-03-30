"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.getPlanById = exports.queryPlans = exports.createPlan = void 0;
const http_status_1 = __importDefault(require("http-status"));
const plan_model_1 = __importDefault(require("../models/plan.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createPlan = async (data) => {
    return plan_model_1.default.create(data);
};
exports.createPlan = createPlan;
const queryPlans = async (onlyActive = true) => {
    const filter = onlyActive ? { isActive: true } : {};
    return plan_model_1.default.find(filter).sort({ price: 1 });
};
exports.queryPlans = queryPlans;
const getPlanById = async (id) => {
    const plan = await plan_model_1.default.findById(id);
    if (!plan)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Plan not found');
    return plan;
};
exports.getPlanById = getPlanById;
const updatePlan = async (id, data) => {
    const plan = await (0, exports.getPlanById)(id);
    Object.assign(plan, data);
    await plan.save();
    return plan;
};
exports.updatePlan = updatePlan;
const deletePlan = async (id) => {
    const plan = await (0, exports.getPlanById)(id);
    await plan.deleteOne();
};
exports.deletePlan = deletePlan;
