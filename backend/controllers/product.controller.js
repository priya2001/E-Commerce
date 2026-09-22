import productService from "../services/product.service.js";

const errorStatus = (message) => {
    if (message.toLowerCase().includes("not found")) {
        return 404;
    }

    if (message.toLowerCase().includes("already exists")) {
        return 409;
    }

    return 400;
};

const getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts(
            req.query,
            false
        );

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllProductsForAdmin = async (req, res) => {
    try {
        const products = await productService.getProducts(
            req.query,
            true
        );

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

const getProductBySlug = async (req, res) => {
    try {
        const product =
            await productService.getProductBySlug(
                req.params.slug
            );

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const product =
            await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

const updateProductStatus = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(errorStatus(error.message)).json({
            success: false,
            message: error.message,
        });
    }
};

export default {
    getProducts,
    getAllProductsForAdmin,
    getProductBySlug,
    createProduct,
    updateProduct,
    updateProductStatus,
    deleteProduct,
};