import passport from "passport";
import local from "passport-local";
import UserModel from "../DAO/mongoManager/models/users.model.js";
import GitHubStrategy from "passport-github2";
import { createHash, generateToken, isValidPassword } from "../utils.js";
import cartModel from "../DAO/mongoManager/models/cart.model.js";
import jwt from 'passport-jwt'

/**
 * 
 * 
 * App ID: 375156

    Client ID: Iv1.42ae653ed8a66872
 *  Secret: 7eff1a591930fc3823944a2934e421ebdda6dba9
 */

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const cookieExtractor = (req) =>
  req && req.cookies ? req.cookies["keyCookieForJWT"] : null;

const initializePassport = () => {

  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: "secretForJWT",
  },
  async (jwtPayload, done) => {
    try {
      done(null, jwtPayload)
    } catch (error) {
      return done(error)
    }
  }))


  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.a2ed1131a5cd0957",
        clientSecret: "ea40aac0956c48f7d2eb7ab8e1a399dc34f75f7b",
        callbackURL: "http://127.0.0.1:8080/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile._json.email;

        try {
          const user = await UserModel.findOne({ email });
          if (user) {
            console.log("User already exits " + email);
            const token = generateToken(user);
            user.token = token;
            return done(null, user);
          }
          const cart = await cartModel.create({ products: [] });
          const newUser = {
            first_name: profile._json.name,
            last_name:"",
            email: profile._json.email,
            age:0,
            password: "",
            social: "github",
            rol: "user",
            cartId
          }
          const result = await UserModel.create(newUser);
          return done(null, result);
        } catch (e) {
          return done("Error to login wuth github" + e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
