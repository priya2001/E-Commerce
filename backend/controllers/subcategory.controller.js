import subcategoryService from "../services/subcategory.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const getSubcategories = asyncHandler(async (req, res) => {
    const subcategories = await subcategoryService.getSubcategories(
        req.query.category
    );
    res.status(200).json({ success: true, subcategories });
});

const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
    const subcategories = await subcategoryService.getSubcategories(
        req.params.categoryId
    );
    res.status(200).json({ success: true, subcategories });
});

const getAllSubcategoriesForAdmin = asyncHandler(async (req, res) => {
    const subcategories = await subcategoryService.getSubcategories(
        req.query.category,
        true
    );
    res.status(200).json({ success: true, subcategories });
});

const createSubcategory = asyncHandler(async (req, res) => {
    const subcategory = await subcategoryService.createSubcategory(req.body);
    res.status(201).json({
        success: true,
        message: "Subcategory created successfully",
        subcategory,
    });
});

const updateSubcategory = asyncHandler(async (req, res) => {
    const subcategory = await subcategoryService.updateSubcategory(
        req.params.id,
        req.body
    );
    res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        subcategory,
    });
});

const updateSubcategoryStatus = asyncHandler(async (req, res) => {
    const subcategory = await subcategoryService.updateSubcategoryStatus(
        req.params.id,
        req.body.isActive
    );
    res.status(200).json({
        success: true,
        message: "Subcategory status updated successfully",
        subcategory,
    });
});

const deleteSubcategory = asyncHandler(async (req, res) => {
    await subcategoryService.deleteSubcategory(req.params.id);
    res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
    });
});

export default {
    getSubcategories,
    getSubcategoriesByCategory,
    getAllSubcategoriesForAdmin,
    createSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,
};
