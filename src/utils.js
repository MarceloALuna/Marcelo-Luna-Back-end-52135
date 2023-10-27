import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { faker } from '@faker-js/faker'

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password); // true o false
};

// Generamos el token
export const generateToken = (user) => {
  const token = jwt.sign({ user }, "secretForJWT", { expiresIn: "24h" });
  return token;
};

// Extraemos el token del header
export const authToken = (req, res, next) => {
  let authHeader = req.headers.auth;
  if (!authHeader) {
    authHeader = req.cookies["keyCookieForJWT"];
    return res.status(401).send({
      error: "Not auth",
    });
  }

  const token = authHeader;
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not authroized" });

    req.user = credentials.user;
    next();
  });
};

export const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: faker.datatype.number(),
    id: faker.database.mongodbObjectId(),
    image: faker.image.imageUrl(),
  };
};

export default __dirname;
