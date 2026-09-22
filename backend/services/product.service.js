import mongoose from "mongoose";
import productRepository from "../repositories/product.repository.js";
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

const validatePrice = (price, discountPrice) => {
    if (price === undefined || Number(price) < 0) {
        throw new Error("Valid product price is required");
    }

    if (
        discountPrice !== undefined &&
        discountPrice !== null &&
        Number(discountPrice) >= Number(price)
    ) {
        throw new Error("Discount price must be less than product price");
    }
};

const validateCategoryAndSubcategory = async (
    categoryId,
    subcategoryId
) => {
    validateId(categoryId, "category");
    validateId(subcategoryId, "subcategory");

    const category = await categoryRepository.findById(categoryId);

    if (!category) {
        throw new Error("Category not found");
    }

    const subcategory =
        await subcategoryRepository.findById(subcategoryId);

    if (!subcategory) {
        throw new Error("Subcategory not found");
    }

    if (
        subcategory.category._id.toString() !==
        categoryId.toString()
    ) {
        throw new Error(
            "Subcategory does not belong to selected category"
        );
    }
};

const getProducts = async (query = {}, includeInactive = false) => {
    const filter = includeInactive ? {} : { isActive: true };

    if (query.category) {
        validateId(query.category, "category");
        filter.category = query.category;
    }

    if (query.subcategory) {
        validateId(query.subcategory, "subcategory");
        filter.subcategory = query.subcategory;
    }

    if (query.brand) {
        filter.brand = query.brand;
    }

    return await productRepository.findAll(filter);
};

const getProductBySlug = async (slug) => {
    const product = await productRepository.findBySlug(
        slug.toLowerCase()
    );

    if (!product || !product.isActive) {
        throw new Error("Product not found");
    }

    return product;
};

const createProduct = async (productData) => {
    const {
        name,
        description,
        price,
        discountPrice = null,
        stock = 0,
        brand = "",
        images = [],
        category,
        subcategory,
    } = productData;

    if (!name || !name.trim()) {
        throw new Error("Product name is required");
    }

    if (!description || !description.trim()) {
        throw new Error("Product description is required");
    }

    if (!category || !subcategory) {
        throw new Error("Category and subcategory are required");
    }

    if (Number(stock) < 0) {
        throw new Error("Stock cannot be negative");
    }

    validatePrice(price, discountPrice);

    await validateCategoryAndSubcategory(
        category,
        subcategory
    );

    const cleanName = name.trim();
    const slug = createSlug(productData.slug || cleanName);
    const duplicate =
        await productRepository.findDuplicate(slug);

    if (duplicate) {
        throw new Error("Product slug already exists");
    }

    const product = await productRepository.create({
        name: cleanName,
        slug,
        description: description.trim(),
        price,
        discountPrice,
        stock,
        brand: brand.trim(),
        images,
        category,
        subcategory,
    });

    return await productRepository.findById(product._id);
};

const updateProduct = async (id, productData) => {
    validateId(id, "product");

    const currentProduct =
        await productRepository.findById(id);

    if (!currentProduct) {
        throw new Error("Product not found");
    }

    const categoryId =
        productData.category ||
        currentProduct.category._id.toString();

    const subcategoryId =
        productData.subcategory ||
        currentProduct.subcategory._id.toString();

    await validateCategoryAndSubcategory(
        categoryId,
        subcategoryId
    );

    const name =
        productData.name?.trim() ||
        currentProduct.name;

    const slug = createSlug(
        productData.slug || name
    );

    const price =
        productData.price ??
        currentProduct.price;

    const discountPrice =
        productData.discountPrice ??
        currentProduct.discountPrice;

    const stock =
        productData.stock ??
        currentProduct.stock;

    validatePrice(price, discountPrice);

    if (Number(stock) < 0) {
        throw new Error("Stock cannot be negative");
    }

    const duplicate =
        await productRepository.findDuplicate(
            slug,
            id
        );

    if (duplicate) {
        throw new Error("Product slug already exists");
    }

    return await productRepository.updateById(id, {
        name,
        slug,
        description:
            productData.description?.trim() ||
            currentProduct.description,
        price,
        discountPrice,
        stock,
        brand:
            productData.brand?.trim() ??
            currentProduct.brand,
        images:
            productData.images ??
            currentProduct.images,
        category: categoryId,
        subcategory: subcategoryId,
    });
};

const updateProductStatus = async (id, isActive) => {
    validateId(id, "product");

    if (typeof isActive !== "boolean") {
        throw new Error(
            "isActive must be true or false"
        );
    }

    const product =
        await productRepository.updateById(id, {
            isActive,
        });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

const deleteProduct = async (id) => {
    validateId(id, "product");

    const product =
        await productRepository.deleteById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

export default {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};