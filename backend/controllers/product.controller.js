import productService from "../services/product.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const getProducts = asyncHandler(async (req, res) => {
    const products = await productService.getProducts(
        req.query,
        false
    );

    res.status(200).json({
        success: true,
        products,
    });
});

const getAllProductsForAdmin = asyncHandler(async (req, res) => {
    const products = await productService.getProducts(
        req.query,
        true
    );

    res.status(200).json({
        success: true,
        products,
    });
});

const getProductBySlug = asyncHandler(async (req, res) => {
    const product =
        await productService.getProductBySlug(
            req.params.slug
        );

    res.status(200).json({
        success: true,
        product,
    });
});

const createProduct = asyncHandler(async (req, res) => {
    const product =
        await productService.createProduct(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const product =
        await productService.updateProduct(
            req.params.id,
            req.body
        );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
    });
});

const updateProductStatus = asyncHandler(async (req, res) => {
    const product =
        await productService.updateProductStatus(
            req.params.id,
            req.body.isActive
        );

    res.status(200).json({
        success: true,
        message: "Product status updated successfully",
        product,
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

export default {
    getProducts,
    getAllProductsForAdmin,
    getProductBySlug,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};
