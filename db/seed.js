// db/seed.js
import db from "./client.js";

async function seed() {
  await db.connect();

  console.log("Seeding database...");

  // insert 1 user
  const {
    rows: [user],
  } = await db.query(`
    INSERT INTO users (username, password)
    VALUES ('bob', 'bobspassword')
    RETURNING *;
  `);

  // insert 10+ products
  const products = [
    ["Bananas", "A bunch of bananas", 1.99],
    ["Apples", "Crisp red apples", 2.49],
    ["Bread", "Whole wheat loaf", 3.5],
    ["Milk", "Gallon of whole milk", 4.25],
    ["Eggs", "Dozen organic eggs", 5.75],
    ["Chicken Breast", "Boneless skinless", 8.99],
    ["Rice", "Long grain white rice", 2.99],
    ["Pasta", "Penne pasta bag", 1.75],
    ["Olive Oil", "Extra virgin", 12.5],
    ["Coffee", "Medium roast ground coffee", 9.95],
  ];

  const productInsertValues = products
    .map((p) => `('${p[0]}', '${p[1]}', ${p[2]})`)
    .join(",\n");

  await db.query(`
    INSERT INTO products (title, description, price)
    VALUES ${productInsertValues}
    RETURNING *;
  `);

  // create an order for the user
  const {
    rows: [order],
  } = await db.query(`
    INSERT INTO orders (date, note, user_id)
    VALUES (CURRENT_DATE, 'First grocery run', ${user.id})
    RETURNING *;
  `);

  // order includes at least 5 products
  await db.query(`
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES
      (${order.id}, 1, 2),
      (${order.id}, 2, 1),
      (${order.id}, 3, 1),
      (${order.id}, 4, 1),
      (${order.id}, 5, 1);
  `);

  console.log("✅ Done!");
  await db.end();
}

seed();
