import { Router } from "express";
import UserModel from "../DAO/mongoManager/models/users.model.js";
import passport from "passport";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import CartModel from "../DAO/mongoManager/models/cart.model.js";

const router = Router();

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("keyCookieForJWT").redirect("/login");
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) return res.render("login", { error: "Usuario no encontrado" });
  if (!isValidPassword(user, password))
    return res.render("login", { error: "Contraseña incorrecta" });
  const access_token = generateToken(user);
  res
    .cookie("keyCookieForJWT", (user.token = access_token), {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    })
    .redirect("/profile");
});

router.post("/register", async (req, res) => {
  const user = req.body;
  const userDB = await UserModel.findOne({ email: user.email });
  if (userDB) return res.render("register", { error: "El usuario ya existe" });
  user.password = createHash(user.password);
  const cart = await CartModel.create({ products: [] });
  const UserCreate = await UserModel.create(req.body);
  UserCreate.cartId.push(cart._id);
  await UserModel.updateOne({ email: user.email }, UserCreate);
  res.redirect("/login");
});

router.get("/current", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.send({ status: "sucess", payload: req.user });
  }
);

export default router;
