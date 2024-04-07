import jwt from "jsonwebtoken";
import { jwtSecret } from "../auth/authController";

export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      console.error("Erro ao verificar o token JWT:", err);
      return res
        .status(403)
        .json({ message: "Token inválido", error: err.message });
    }
    req.user = decoded;
    next();
  });
};
