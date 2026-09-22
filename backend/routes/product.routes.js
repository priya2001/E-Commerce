import express from "express";
import productController from "../controllers/product.controller.js";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", productController.getProducts);

router.get(
    "/admin/all",
    protect,
    adminOnly,
    productController.getAllProductsForAdmin
);

router.get(
    "/:slug",
    productController.getProductBySlug
);

router.post(
    "/",
    protect,
    adminOnly,
    productController.createProduct
);

router.put(
    "/:id",
    protect,
    adminOnly,
    productController.updateProduct
);

router.patch(
    "/:id/status",
    protect,
    adminOnly,
    productController.updateProductStatus
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    productController.deleteProduct
);

export default router;