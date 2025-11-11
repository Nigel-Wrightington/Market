import express from "express";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getProductsByOrder,
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";

const router = express.Router();

// Middleware to attach user from token for all routes
router.use(getUserFromToken);

// POST /orders - protected, requires date
router.post("/", requireUser, requireBody(["date"]), async (req, res) => {
  const { date, note } = req.body;
  try {
    const order = await createOrder(req.user.id, date, note || null);
    res.status(201).json(order);
  } catch (e) {
    console.error(e);
    res.status(400).send("Could not create order.");
  }
});

// GET /orders - protected, get all orders for user
router.get("/", requireUser, async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.status(200).json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching orders.");
  }
});

// GET /orders/:id - protected, get specific order
router.get("/:id", requireUser, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");

    // Check if user owns this order
    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");

    res.status(200).json(order);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching order.");
  }
});

// POST /orders/:id/products - protected, add product to order
router.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res) => {
    const { productId, quantity } = req.body;
    try {
      const order = await getOrderById(req.params.id);
      if (!order) return res.status(404).send("Order not found.");

      if (order.user_id !== req.user.id)
        return res.status(403).send("Forbidden.");

      // Check if product exists
      const product = await getProductById(productId);
      if (!product) return res.status(400).send("Product not found.");

      const orderProduct = await addProductToOrder(
        req.params.id,
        productId,
        quantity
      );
      res.status(201).json(orderProduct);
    } catch (e) {
      console.error(e);
      res.status(400).send("Could not add product to order.");
    }
  }
);

// GET /orders/:id/products - protected, get products in order
router.get("/:id/products", requireUser, async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");

    if (order.user_id !== req.user.id)
      return res.status(403).send("Forbidden.");

    const products = await getProductsByOrder(req.params.id);
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error fetching products.");
  }
});

export default router;
