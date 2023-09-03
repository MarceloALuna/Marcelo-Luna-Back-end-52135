import mongoose from "mongoose";

const cartModel = new mongoose.Schema({
    name: {type: String, required: true},
    image: String,
    price: Number,
    description: String,
    Stock: Number
})

export default cartModel