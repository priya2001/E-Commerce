import express from "express";
import categoryController from "../controllers/category.controller.js";
import subcategoryController from "../controllers/subcategory.controller.js";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/admin/all", protect, adminOnly, categoryController.getAllCategoriesForAdmin);
router.get("/:categoryId/subcategories", subcategoryController.getSubcategoriesByCategory);
router.get("/:slug", categoryController.getCategoryBySlug);

router.post("/", protect, adminOnly, categoryController.createCategory);

router.put("/:id", protect, adminOnly, categoryController.updateCategory);

router.patch("/:id/status",protect,adminOnly,categoryController.updateCategoryStatus);

router.delete("/:id", protect, adminOnly, categoryController.deleteCategory);

export default router;
