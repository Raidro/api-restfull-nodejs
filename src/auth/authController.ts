import jwt from "jsonwebtoken";
import { hardcodedUser } from "../models/User";
import jwtConfig from "./jwtConfig";

export const authenticateUser = (
  username: string,
  password: string
): string | null => {
  if (
    username === hardcodedUser.username &&
    password === hardcodedUser.password
  ) {
    return jwt.sign({ username }, jwtConfig.secret, { expiresIn: "1h" });
  }
  return null;
};
