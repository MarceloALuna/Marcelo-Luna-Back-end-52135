import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  social: String,
  cartId: [
    {
      cid: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
    }
  ],
  rol: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
  },
});

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
