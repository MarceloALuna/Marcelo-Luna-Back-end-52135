import UserModel from "../DAO/mongoManager/models/users.model.js";
import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", "/login"),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).render("login");
    req.session.user = req.user;
    const { first_name, last_name, age, rol } = user;
    return res.render("profile", user);
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.json({ status: "Logout ERROR", body: error });
    }
    res.redirect("/login");
  });
});


router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  async (req, res) => {
    res.redirect("/login");
  }
);


export default router;
