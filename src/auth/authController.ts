import jwt from "jsonwebtoken";
import { hardcodedUser } from "../models/User";
import { generateJwtSecret } from "../utils/generateJwtSecret";

// Gerar o segredo JWT dinamicamente
export const jwtSecret = generateJwtSecret();

export const authenticateUser = (
  username: string,
  password: string
): string | null => {
  if (
    username === hardcodedUser.username &&
    password === hardcodedUser.password
  ) {
    return jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
  }
  return null;
};
