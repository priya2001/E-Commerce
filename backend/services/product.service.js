import mongoose from "mongoose";
import productRepository from "../repositories/product.repository.js";
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

const validatePrice = (price, discountPrice) => {
    if (price === undefined || Number(price) < 0) {
        throw new AppError("Valid product price is required", 400);
    }

    if (
        discountPrice !== undefined &&
        discountPrice !== null &&
        Number(discountPrice) >= Number(price)
    ) {
        throw new AppError(
            "Discount price must be less than product price",
            400
        );
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
        throw new AppError("Category not found", 404);
    }

    const subcategory =
        await subcategoryRepository.findById(subcategoryId);

    if (!subcategory) {
        throw new AppError("Subcategory not found", 404);
    }

    if (
        subcategory.category._id.toString() !==
        categoryId.toString()
    ) {
        throw new AppError(
            "Subcategory does not belong to selected category",
            400
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
    if (!slug || !slug.trim()) {
        throw new AppError("Product slug is required", 400);
    }

    const product = await productRepository.findBySlug(
        slug.toLowerCase()
    );

    if (!product || !product.isActive) {
        throw new AppError("Product not found", 404);
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
        throw new AppError("Product name is required", 400);
    }

    if (!description || !description.trim()) {
        throw new AppError("Product description is required", 400);
    }

    if (!category || !subcategory) {
        throw new AppError(
            "Category and subcategory are required",
            400
        );
    }

    if (Number(stock) < 0) {
        throw new AppError("Stock cannot be negative", 400);
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
        throw new AppError("Product slug already exists", 409);
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
        throw new AppError("Product not found", 404);
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
        throw new AppError("Stock cannot be negative", 400);
    }

    const duplicate =
        await productRepository.findDuplicate(
            slug,
            id
        );

    if (duplicate) {
        throw new AppError("Product slug already exists", 409);
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
        throw new AppError(
            "isActive must be true or false",
            400
        );
    }

    const product =
        await productRepository.updateById(id, {
            isActive,
        });

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    return product;
};

const deleteProduct = async (id) => {
    validateId(id, "product");

    const product =
        await productRepository.deleteById(id);

    if (!product) {
        throw new AppError("Product not found", 404);
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
