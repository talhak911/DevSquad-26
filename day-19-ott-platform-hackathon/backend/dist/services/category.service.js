"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
    if (await models_1.Category.findOne({ name: categoryBody.name })) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category already exists');
    }
    return models_1.Category.create(categoryBody);
};
/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
    const categories = await models_1.Category.paginate(filter, options);
    return categories;
};
/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
    return models_1.Category.findById(id);
};
/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
    const category = await getCategoryById(categoryId);
    if (!category) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    if (updateBody.name && (await models_1.Category.findOne({ name: updateBody.name, _id: { $ne: categoryId } }))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category name already exists');
    }
    Object.assign(category, updateBody);
    await category.save();
    return category;
};
/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
    const category = await getCategoryById(categoryId);
    if (!category) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    await category.remove();
    return category;
};
exports.default = {
    createCategory,
    queryCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
};
