import mongoose from "mongoose";

const cartcollection = 'cart'

const cartSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: String,
    price: Number,
    description: String,
    Stock: Number
})

const cartModel = mongoose.model(cartcollection, cartSchema)

export default cartModel