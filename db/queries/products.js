import db from "#db/client";

/** Get all products */
export async function getAllProducts() {
  const { rows } = await db.query("SELECT * FROM products");
  return rows;
}

/** Get a product by ID */
export async function getProductById(id) {
  const { rows } = await db.query("SELECT * FROM products WHERE id = $1", [id]);
  return rows[0];
}

/** Get all orders made by a user that include a specific product */
export async function getOrdersByUserAndProduct(userId, productId) {
  const { rows } = await db.query(
    `
    SELECT DISTINCT o.*
    FROM orders o
    JOIN orders_products op ON o.id = op.order_id
    WHERE o.user_id = $1 AND op.product_id = $2
    `,
    [userId, productId]
  );
  return rows;
}
