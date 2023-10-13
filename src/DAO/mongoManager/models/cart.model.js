import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        quantity: Number,
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
      },
    ],
  },
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
