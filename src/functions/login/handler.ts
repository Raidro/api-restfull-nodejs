import express from "express";
import serverless from "serverless-http";
import { authenticateUser } from "../../auth/authController";

const app = express();

app.use(express.json());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const token = authenticateUser(username, password);
  if (token) {
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

export const handler = serverless(app);
