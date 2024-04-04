import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { hardcodedUser } from "../models/User";
import jwtConfig from "./jwtConfig";

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (
    username === hardcodedUser.username &&
    password === hardcodedUser.password
  ) {
    const token = jwt.sign({ username }, jwtConfig.secret, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
};
