import categoryService from "../services/category.service.js";

const errorStatus = (message) => {
    if (message.toLowerCase().includes("not found")) return 404;
    if (message.toLowerCase().includes("already exists")) return 409;
    return 400;
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories(false);
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllCategoriesForAdmin = async (req, res) => {
    try {
        const categories = await categoryService.getCategories(true);
        res.status(200).json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const data = await categoryService.getCategoryBySlug(req.params.slug);
        res.status(200).json({ success: true, ...data });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const updateCategoryStatus = async (req, res) => {
    try {
        const category = await categoryService.updateCategoryStatus(
            req.params.id,
            req.body.isActive
        );
        res.status(200).json({
            success: true,
            message: "Category status updated successfully",
            category,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

export default {
    getCategories,
    getAllCategoriesForAdmin,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
};
