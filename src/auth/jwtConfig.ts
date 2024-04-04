import { generateJwtSecret } from "../utils/generateJwtSecret";

const jwtSecret = generateJwtSecret();

export default {
  secret: jwtSecret,
};
