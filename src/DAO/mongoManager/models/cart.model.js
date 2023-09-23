import mongoose from "mongoose";

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: String,
    price: Number,
    description: String,
    Stock: Number
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel