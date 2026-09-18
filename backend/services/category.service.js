import mongoose from "mongoose";
import categoryRepository from "../repositories/category.repository.js";
import subcategoryRepository from "../repositories/subcategory.repository.js";

const createSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};

const validateId = (id) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error("Invalid category ID");
    }
};

const getCategories = async (includeInactive = false) => {
    return await categoryRepository.findAll(includeInactive ? {} : { isActive: true });
};

const getCategoryBySlug = async (slug) => {
    const category = await categoryRepository.findBySlug(slug.toLowerCase());

    if (!category || !category.isActive) {
        throw new Error("Category not found");
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
        throw new Error("Category name is required");
    }

    const cleanName = name.trim();
    const slug = createSlug(categoryData.slug || cleanName);
    const duplicate = await categoryRepository.findDuplicate(cleanName, slug);

    if (duplicate) {
        throw new Error("Category name or slug already exists");
    }

    return await categoryRepository.create({ name: cleanName, slug, image });
};

const updateCategory = async (id, categoryData) => {
    validateId(id);
    const currentCategory = await categoryRepository.findById(id);

    if (!currentCategory) {
        throw new Error("Category not found");
    }

    const name = categoryData.name?.trim() || currentCategory.name;
    const slug = createSlug(categoryData.slug || name);
    const duplicate = await categoryRepository.findDuplicate(name, slug, id);

    if (duplicate) {
        throw new Error("Category name or slug already exists");
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
        throw new Error("isActive must be true or false");
    }

    const category = await categoryRepository.updateById(id, { isActive });

    if (!category) {
        throw new Error("Category not found");
    }

    return category;
};

const deleteCategory = async (id) => {
    validateId(id);
    const subcategoryCount = await subcategoryRepository.countByCategory(id);

    if (subcategoryCount > 0) {
        throw new Error("Delete related subcategories before deleting this category");
    }

    const category = await categoryRepository.deleteById(id);

    if (!category) {
        throw new Error("Category not found");
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
