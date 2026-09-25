import mongoose from "mongoose";
import categoryRepository from "../repositories/category.repository.js";
import subcategoryRepository from "../repositories/subcategory.repository.js";
import AppError from "../utils/appError.js";

const createSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const validateId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new AppError("Invalid category ID", 400);
    }
};

const getCategories = async (includeInactive = false) => {
    return await categoryRepository.findAll(includeInactive ? {} : { isActive: true });
};

const getCategoryBySlug = async (slug) => {
    const category = await categoryRepository.findBySlug(slug.toLowerCase());

    if (!category || !category.isActive) {
        throw new AppError("Category not found", 404);
    }

    const subcategories = await subcategoryRepository.findAll({
        category: category._id,
        isActive: true,
    });

    return { category, subcategories };
};

const createCategory = async (categoryData) => {
    const { name, image = "" } = categoryData;

    if (!name || !name.trim()) {
        throw new AppError("Category name is required", 400);
    }

    const cleanName = name.trim();
    const slug = createSlug(categoryData.slug || cleanName);
    const duplicate = await categoryRepository.findDuplicate(cleanName, slug);

    if (duplicate) {
        throw new AppError(
            "Category name or slug already exists",
            409
        );
    }

    return await categoryRepository.create({ name: cleanName, slug, image });
};

const updateCategory = async (id, categoryData) => {
    validateId(id);
    const currentCategory = await categoryRepository.findById(id);

    if (!currentCategory) {
        throw new AppError("Category not found", 404);
    }

    const name = categoryData.name?.trim() || currentCategory.name;
    const slug = createSlug(categoryData.slug || name);
    const duplicate = await categoryRepository.findDuplicate(name, slug, id);

    if (duplicate) {
        throw new AppError(
            "Category name or slug already exists",
            409
        );
    }

    return await categoryRepository.updateById(id, {
        name,
        slug,
        image: categoryData.image ?? currentCategory.image,
    });
};

const updateCategoryStatus = async (id, isActive) => {
    validateId(id);

    if (typeof isActive !== "boolean") {
        throw new AppError("isActive must be true or false", 400);
    }

    const category = await categoryRepository.updateById(id, { isActive });

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    return category;
};

const deleteCategory = async (id) => {
    validateId(id);
    const subcategoryCount = await subcategoryRepository.countByCategory(id);

    if (subcategoryCount > 0) {
        throw new AppError(
            "Delete related subcategories before deleting this category",
            409
        );
    }

    const category = await categoryRepository.deleteById(id);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    return category;
};

export default {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
};
