import Product from "../models/product.model.js";

const findAll = async (filter = {}) => {
    return await Product.find(filter)
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .sort({ createdAt: -1 });
};

const findById = async (id) => {
    return await Product.findById(id)
        .populate("category", "name slug")
        .populate("subcategory", "name slug");
};

const findBySlug = async (slug) => {
    return await Product.findOne({ slug })
        .populate("category", "name slug")
        .populate("subcategory", "name slug");
};

const findDuplicate = async (slug, excludeId) => {
    const filter = { slug };

    if (excludeId) {
        filter._id = { $ne: excludeId };
    }

    return await Product.findOne(filter);
};

const create = async (productData) => {
    return await Product.create(productData);
};

const updateById = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, {
        returnDocument: "after",
        runValidators: true,
    })
        .populate("category", "name slug")
        .populate("subcategory", "name slug");
};

const deleteById = async (id) => {
    return await Product.findByIdAndDelete(id);
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