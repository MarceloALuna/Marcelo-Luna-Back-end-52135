import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import productModel from "./DAO/mongoManager/models/product.model.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import userRouter from "./routes/session.route.js";
import cookieParser from "cookie-parser";

const app = express();
const uri =
  "mongodb+srv://marceloaluna:marceloaluna1988@clusterml.2fhj61b.mongodb.net/?retryWrites=true&w=majority";
const dbName = "ecommerce";

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));

// Session Mongo


app.use(
  session({
    store: MongoStore.create({
      mongoUrl: uri,
      dbName,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 1500000,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("KeyCookieForJWT"));
app.use("/", viewsRouter);
app.use("/api/session", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);



mongoose
  .connect(uri, { dbName })
  .then(() => {
    console.log("DB connected!!");
    runServer();
  })
  .catch((e) => console.log(`Can't connect to DB`));

console.log("Connecting...");

const mensajes = [];

const runServer = () => {
  const httpServer = app.listen(8080, () => console.log("Listening..."));
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("message", (data) => {
      mensajes.push(data);
      io.emit("logs", mensajes);
    });

    socket.on("new-product", async (data) => {
      console.log(data);
      const productManager = new productModel(data);
      await productManager.save();

      const products = await productModel.find().lean().exec();
      io.emit("reload-table", products);
    });
  });
};
