import Category from "../models/category.model.js";

const findAll = async (filter = {}) => {
    return await Category.find(filter).sort({ name: 1 });
};

const findById = async (id) => {
    return await Category.findById(id);
};

const findBySlug = async (slug) => {
    return await Category.findOne({ slug });
};

const findDuplicate = async (name, slug, excludeId) => {
    const filter = { $or: [{ name }, { slug }] };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    return await Category.findOne(filter);
};

const create = async (categoryData) => {
    return await Category.create(categoryData);
};

const updateById = async (id, categoryData) => {
    return await Category.findByIdAndUpdate(id, categoryData, {
        returnDocument: "after",
        runValidators: true,
    });
};

const deleteById = async (id) => {
    return await Category.findByIdAndDelete(id);
};

export default {
    findAll,
    findById,
    findBySlug,
    findDuplicate,
    create,
    updateById,
    deleteById,
};
