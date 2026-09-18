import Subcategory from "../models/subcategory.model.js";

const findAll = async (filter = {}) => {
    return await Subcategory.find(filter)
        .populate("category", "name slug")
        .sort({ name: 1 });
};

const findById = async (id) => {
    return await Subcategory.findById(id).populate("category", "name slug");
};

const findDuplicate = async (category, slug, excludeId) => {
    const filter = { category, slug };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    return await Subcategory.findOne(filter);
};

const create = async (subcategoryData) => {
    return await Subcategory.create(subcategoryData);
};

const updateById = async (id, subcategoryData) => {
    return await Subcategory.findByIdAndUpdate(id, subcategoryData, {
        new: true,
        runValidators: true,
    }).populate("category", "name slug");
};

const deleteById = async (id) => {
    return await Subcategory.findByIdAndDelete(id);
};

const countByCategory = async (category) => {
    return await Subcategory.countDocuments({ category });
};

export default {
    findAll,
    findById,
    findDuplicate,
    create,
    updateById,
    deleteById,
    countByCategory,
};
