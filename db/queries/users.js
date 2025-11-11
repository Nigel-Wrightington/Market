import db from "#db/client";
import bcrypt from "bcrypt";

/** Find a user by ID */
export async function getUserById(id) {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

/** Find a user by username */
export async function getUserByUsername(username) {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
}

/** Create a new user with hashed password */
export async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, hashedPassword]
  );
  return rows[0];
}

/** Verify that a plaintext password matches a user's hashed password */
export async function verifyPassword(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed);
}
