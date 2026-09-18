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

const validateId = (id, label) => {
    if (!mongoose.isValidObjectId(id)) {
        throw new Error(`Invalid ${label} ID`);
    }
};

const getSubcategories = async (categoryId, includeInactive = false) => {
    const filter = includeInactive ? {} : { isActive: true };

    if (categoryId) {
        validateId(categoryId, "category");
        const category = await categoryRepository.findById(categoryId);

        if (!category || (!includeInactive && !category.isActive)) {
            throw new Error("Parent category not found");
        }

        filter.category = categoryId;
    }

    return await subcategoryRepository.findAll(filter);
};

const createSubcategory = async (subcategoryData) => {
    const { name, category, image = "" } = subcategoryData;

    if (!name || !name.trim() || !category) {
        throw new Error("Subcategory name and category are required");
    }

    validateId(category, "category");
    const parentCategory = await categoryRepository.findById(category);

    if (!parentCategory) {
        throw new Error("Parent category not found");
    }

    const cleanName = name.trim();
    const slug = createSlug(subcategoryData.slug || cleanName);
    const duplicate = await subcategoryRepository.findDuplicate(category, slug);

    if (duplicate) {
        throw new Error("Subcategory slug already exists in this category");
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
        throw new Error("Subcategory not found");
    }

    const categoryId = subcategoryData.category || currentSubcategory.category._id;
    validateId(categoryId, "category");

    const parentCategory = await categoryRepository.findById(categoryId);

    if (!parentCategory) {
        throw new Error("Parent category not found");
    }

    const name = subcategoryData.name?.trim() || currentSubcategory.name;
    const slug = createSlug(subcategoryData.slug || name);
    const duplicate = await subcategoryRepository.findDuplicate(categoryId, slug, id);

    if (duplicate) {
        throw new Error("Subcategory slug already exists in this category");
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
        throw new Error("isActive must be true or false");
    }

    const subcategory = await subcategoryRepository.updateById(id, { isActive });

    if (!subcategory) {
        throw new Error("Subcategory not found");
    }

    return subcategory;
};

const deleteSubcategory = async (id) => {
    validateId(id, "subcategory");
    const subcategory = await subcategoryRepository.deleteById(id);

    if (!subcategory) {
        throw new Error("Subcategory not found");
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
