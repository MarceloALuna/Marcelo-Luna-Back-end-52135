import { Router } from "express";
import ProductManager from "../DAO/fileManager/product.manager.js";
import productModel from "../DAO/mongoManager/models/product.model.js";
import cartModel from "../DAO/mongoManager/models/cart.model.js";
import passport from "passport";
import { generateProducts } from "../utils.js";

const router = Router();
const productManager = new ProductManager();

router.get("/login", (req, res) => {
  if (req.session?.user) return res.redirect("/profile");
  res.render("login", {});
});
router.get("/register", (req, res) => {
  if (req.session?.user) return res.redirect("/profile");
  res.render("register", {});
});

router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const page = parseInt(req.query?.page || 1);
  const limit = parseInt(req.query?.limit || 10);
  const sort = req.params.sort || "asd";
  const queryParams = req.query?.query || "";
  const query = {};
  if (query) {
    const field = queryParams.split(",")[0];
    let value = queryParams.split(",")[1];
    if (isNaN(parseInt(value))) value = parseInt(value);
    query[field] = value;
  }
  const result = await productModel.paginate(query, {
    page,
    limit,
    lean: true,
    sort,
  });
  result.prevLink = result.hasPrevPage
    ? `/?page=${result.prevPage}&limit=${limit}`
    : "";
  result.nextLink = result.hasNextPage
    ? `/?page=${result.nextPage}&limit=${limit}`
    : "";
  res.render("products", result);
});

router.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    const user = req.user;
    const cart = await cartModel.findOne().lean().exec();
    const products = await ProductModel.find().lean().exec();
    console.log({ cart });
    res.render("products", { products, cart, user, css: "products" });
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { user } = req.user;
    console.log(user);
    res.render("profile", user);
  }
);

router.get("/products-realtime", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const products = await productManager.list();
  res.render("products_realtime", { products });
});

router.get(
  "/form-products",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.render("form", {});
  }
);

router.post(
  "/form-products",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const data = req.body;
    const result = await productModel.create(data);

    res.redirect("/");
  }
);

router.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const message = req.body;
    res.render("chat", {});
  }
);

router.get("/cart/:cid", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const cartId = req.params.cid;
  const cart = await cartModel
    .findById(cartId)
    .populate("products.products_id")
    .lean()
    .exec();
  res.render("cart", { cart });
});

router.get("/cart", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const carts = await cartModel.find().lean().exec();
  res.render("cart", {});
});

router.get(
  "/login-github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    console.log("Callback: ", req.user);
    req.session.user = req.user;
    console.log(req.session);
    res.redirect("/profile");
  }
);

router.get("/mockingproducts", async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  res.send({ status: "success", payload: products });
});

export default router;
