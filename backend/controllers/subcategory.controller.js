import subcategoryService from "../services/subcategory.service.js";

const errorStatus = (message) => {
    if (message.toLowerCase().includes("not found")) return 404;
    if (message.toLowerCase().includes("already exists")) return 409;
    return 400;
};

const getSubcategories = async (req, res) => {
    try {
        const subcategories = await subcategoryService.getSubcategories(req.query.category);
        res.status(200).json({ success: true, subcategories });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const getSubcategoriesByCategory = async (req, res) => {
    try {
        const subcategories = await subcategoryService.getSubcategories(
            req.params.categoryId
        );
        res.status(200).json({ success: true, subcategories });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const getAllSubcategoriesForAdmin = async (req, res) => {
    try {
        const subcategories = await subcategoryService.getSubcategories(
            req.query.category,
            true
        );
        res.status(200).json({ success: true, subcategories });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const createSubcategory = async (req, res) => {
    try {
        const subcategory = await subcategoryService.createSubcategory(req.body);
        res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            subcategory,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const updateSubcategory = async (req, res) => {
    try {
        const subcategory = await subcategoryService.updateSubcategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            subcategory,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const updateSubcategoryStatus = async (req, res) => {
    try {
        const subcategory = await subcategoryService.updateSubcategoryStatus(
            req.params.id,
            req.body.isActive
        );
        res.status(200).json({
            success: true,
            message: "Subcategory status updated successfully",
            subcategory,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

const deleteSubcategory = async (req, res) => {
    try {
        await subcategoryService.deleteSubcategory(req.params.id);
        res.status(200).json({ success: true, message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(errorStatus(error.message)).json({ success: false, message: error.message });
    }
};

export default {
    getSubcategories,
    getSubcategoriesByCategory,
    getAllSubcategoriesForAdmin,
    createSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,
};
