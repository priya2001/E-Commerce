import express from "express";
import subcategoryController from "../controllers/subcategory.controller.js";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", subcategoryController.getSubcategories);
router.get("/admin/all", protect, adminOnly, subcategoryController.getAllSubcategoriesForAdmin);

router.post("/", protect, adminOnly, subcategoryController.createSubcategory);

router.put("/:id", protect, adminOnly, subcategoryController.updateSubcategory);

router.patch("/:id/status", protect, adminOnly, subcategoryController.updateSubcategoryStatus);

router.delete("/:id", protect, adminOnly, subcategoryController.deleteSubcategory);

export default router;
