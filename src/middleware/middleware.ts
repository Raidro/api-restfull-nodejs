import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwtConfig from "../auth/jwtConfig";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).send("Token não fornecido");
  }

  jwt.verify(token, jwtConfig.secret, (err: any, user: any) => {
    if (err) {
      return res.status(403).send("Token inválido");
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
