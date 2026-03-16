import { Router } from "express";
import { categoryController } from "../controllers/categoryController.js";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories
 *     responses:
 *       200:
 *         description: A list of categories
 */
router.get("/", categoryController.getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{name}:
 *   delete:
 *     summary: Delete a category and its tasks
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete("/:name", categoryController.deleteCategory);

export default router;
