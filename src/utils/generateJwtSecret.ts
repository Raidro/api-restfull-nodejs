import crypto from "crypto";

export const generateJwtSecret = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
