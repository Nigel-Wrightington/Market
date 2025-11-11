import db from "#db/client";

/** Create a new order for a user */
export async function createOrder(userId, date, note) {
  const { rows } = await db.query(
    "INSERT INTO orders (user_id, date, note) VALUES ($1, $2, $3) RETURNING *",
    [userId, date, note]
  );
  return rows[0];
}

/** Get all orders made by a user */
export async function getOrdersByUser(userId) {
  const { rows } = await db.query("SELECT * FROM orders WHERE user_id = $1", [
    userId,
  ]);
  return rows;
}

/** Get an order by ID */
export async function getOrderById(id) {
  const { rows } = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  return rows[0];
}

/** Add a product to an order */
export async function addProductToOrder(orderId, productId, quantity) {
  const { rows } = await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [orderId, productId, quantity]
  );
  return rows[0];
}

/** Get all products in an order */
export async function getProductsByOrder(orderId) {
  const { rows } = await db.query(
    `
    SELECT p.*
    FROM products p
    JOIN orders_products op ON p.id = op.product_id
    WHERE op.order_id = $1
    `,
    [orderId]
  );
  return rows;
}
