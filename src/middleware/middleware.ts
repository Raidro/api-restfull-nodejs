// middleware/authenticateToken.ts
import jwt from "jsonwebtoken";
import jwtConfig from "../auth/jwtConfig";

export const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, jwtConfig.secret, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};
