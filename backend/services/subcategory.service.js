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

const validateId = (id, label) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new AppError(`Invalid ${label} ID`, 400);
    }
};

const getSubcategories = async (categoryId, includeInactive = false) => {
    const filter = includeInactive ? {} : { isActive: true };

    if (categoryId) {
        validateId(categoryId, "category");
        const category = await categoryRepository.findById(categoryId);

        if (!category || (!includeInactive && !category.isActive)) {
            throw new AppError("Parent category not found", 404);
        }

        filter.category = categoryId;
    }

    return await subcategoryRepository.findAll(filter);
};

const createSubcategory = async (subcategoryData) => {
    const { name, category, image = "" } = subcategoryData;

    if (!name || !name.trim() || !category) {
        throw new AppError(
            "Subcategory name and category are required",
            400
        );
    }

    validateId(category, "category");
    const parentCategory = await categoryRepository.findById(category);

    if (!parentCategory) {
        throw new AppError("Parent category not found", 404);
    }

    const cleanName = name.trim();
    const slug = createSlug(subcategoryData.slug || cleanName);
    const duplicate = await subcategoryRepository.findDuplicate(category, slug);

    if (duplicate) {
        throw new AppError(
            "Subcategory slug already exists in this category",
            409
        );
    }

    return await subcategoryRepository.create({
        name: cleanName,
        slug,
        image,
        category,
    });
};

const updateSubcategory = async (id, subcategoryData) => {
    validateId(id, "subcategory");
    const currentSubcategory = await subcategoryRepository.findById(id);

    if (!currentSubcategory) {
        throw new AppError("Subcategory not found", 404);
    }

    const categoryId = subcategoryData.category || currentSubcategory.category._id;
    validateId(categoryId, "category");

    const parentCategory = await categoryRepository.findById(categoryId);

    if (!parentCategory) {
        throw new AppError("Parent category not found", 404);
    }

    const name = subcategoryData.name?.trim() || currentSubcategory.name;
    const slug = createSlug(subcategoryData.slug || name);
    const duplicate = await subcategoryRepository.findDuplicate(categoryId, slug, id);

    if (duplicate) {
        throw new AppError(
            "Subcategory slug already exists in this category",
            409
        );
    }

    return await subcategoryRepository.updateById(id, {
        name,
        slug,
        image: subcategoryData.image ?? currentSubcategory.image,
        category: categoryId,
    });
};

const updateSubcategoryStatus = async (id, isActive) => {
    validateId(id, "subcategory");

    if (typeof isActive !== "boolean") {
        throw new AppError("isActive must be true or false", 400);
    }

    const subcategory = await subcategoryRepository.updateById(id, { isActive });

    if (!subcategory) {
        throw new AppError("Subcategory not found", 404);
    }

    return subcategory;
};

const deleteSubcategory = async (id) => {
    validateId(id, "subcategory");
    const subcategory = await subcategoryRepository.deleteById(id);

    if (!subcategory) {
        throw new AppError("Subcategory not found", 404);
    }

    return subcategory;
};

export default {
    getSubcategories,
    createSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,
};
