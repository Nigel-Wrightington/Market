import express from "express";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";
import {
  getAllProducts,
  getProductById,
  getOrdersByUserAndProduct,
} from "#db/queries/products";

const router = express.Router();

// GET /products - no auth needed
router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching products.");
  }
});

// GET /products/:id - no auth needed
router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");
    res.status(200).json(product);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching product.");
  }
});

// GET /products/:id/orders - protected, check product existence first
router.get("/:id/orders", getUserFromToken, requireUser, async (req, res) => {
  try {
    // Check if product exists first (even if user not logged in, we return 404 for missing product)
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found.");

    const orders = await getOrdersByUserAndProduct(req.user.id, req.params.id);
    res.status(200).json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching orders.");
  }
});

export default router;
