import express from "express";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import {
  createUser,
  getUserByUsername,
  verifyPassword,
} from "#db/queries/users";

const router = express.Router();

// POST /users/register
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await createUser(username, password);
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (e) {
      console.error(e);
      res.status(400).send("Could not create user.");
    }
  }
);

// POST /users/login
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await getUserByUsername(username);
      if (!user) return res.status(401).send("Invalid credentials.");

      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) return res.status(401).send("Invalid credentials.");

      const token = createToken({ id: user.id });
      res.status(200).send(token);
    } catch (e) {
      console.error(e);
      res.status(401).send("Invalid credentials.");
    }
  }
);

export default router;
