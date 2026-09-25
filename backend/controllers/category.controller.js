import categoryService from "../services/category.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories(false);
    res.status(200).json({ success: true, categories });
});

const getAllCategoriesForAdmin = asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories(true);
    res.status(200).json({ success: true, categories });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
    const data = await categoryService.getCategoryBySlug(req.params.slug);
    res.status(200).json({ success: true, ...data });
});

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
    });
});

const updateCategoryStatus = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategoryStatus(
        req.params.id,
        req.body.isActive
    );
    res.status(200).json({
        success: true,
        message: "Category status updated successfully",
        category,
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});

export default {
    getCategories,
    getAllCategoriesForAdmin,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
};
